const express = require('express');
const app = require('../../../d3/authorization-in-express/app');
const db = require('../db/models');
const router = express.Router();
const { Tweet } = db;
const asyncHandler = require('./utils');

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
    const allTweets = await Tweet.findAll();
    res.json(allTweets);
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

module.exports = router;
