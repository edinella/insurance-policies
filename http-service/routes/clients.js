const express = require('express');
const router = express.Router();

router.get('/clients', (req, res, next) => {
  res.send('respond with clients');
});

module.exports = router;
