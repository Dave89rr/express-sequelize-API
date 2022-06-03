const express = require('express');
const db = require('../db/models');
const router = express.Router();
const { Tweet } = db;
const asyncHandler = require('./utils');
const { check, validationResult } = require('express-validator');
const res = require('express/lib/response');
const { sequelize } = require('../db/models');

const tweetValidation = [
  check('message')
    .exists({ checkFalsy: true })
    .withMessage('Please provide content for your tweet')
    .isLength({ max: 280 })
    .withMessage('Message too long. Please limit to 280 characters'),
];

// Not Found error
const tweetNotFoundError = (id) => {
  const err = new Error(`A tweet of id ${id} could not be found`);
  err.title = 'Tweet not found';
  err.status = 404;
  return err;
};

router.get(
  '/tweets',
  asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
  })
);

router.get(
  '/tweets/:id(\\d+)',
  asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet !== null) return res.json(tweet);
    else next(tweetNotFoundError(tweetId));
  })
);
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error('Bad Request');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad Request.';
    return next(err);
  }
  next();
};
router.post(
  '/tweets',
  tweetValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    Tweet.create({
      message: req.body.message,
    });
    res.redirect('/tweets');
  })
);

router.put(
  '/tweets/:id(\\d+)',
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const tweetId = req.params.id;
    const toUpdate = await Tweet.findByPk(tweetId);

    if (!toUpdate) {
      return next(tweetNotFoundError(tweetId));
    }

    toUpdate.message = req.body.message;

    toUpdate.save();

    res.redirect(`/tweets/${tweetId}`);
  })
);

router.delete(
  '/tweets/:id(\\d+)',
  asyncHandler(async (req, res) => {
    const tweetId = req.params.id;
    const toDelete = await Tweet.findByPk(tweetId);

    if (!toDelete) {
      return next(tweetNotFoundError(tweetId));
    }

    await toDelete.destroy();
    res.status(204).end();
  })
);

module.exports = router;
