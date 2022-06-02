const express = require('express');

const router = express.Router();

// router.use()

router.get('/', (req, res) => {
  res.json({
    title: 'Greeting',
    message: 'Test Tweets Index',
  });
});

module.exports = router;
