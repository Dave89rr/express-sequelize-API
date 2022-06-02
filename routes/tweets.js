const express = require('express');
const db = require("../db/models");
const router = express.Router();
const { Tweet } = db;
const asyncHandler = require('./utils')

router.get('/tweets', asyncHandler(async(req, res) => {
  const allTweets = await Tweet.findAll()
  res.json(allTweets)
}))

router.get('/tweets/:id(\\d+)', asyncHandler(async(req, res) => {
  const tweet = await Tweet.findByPK(req.params.id)
  res.json(tweet);
}))


module.exports = router;
