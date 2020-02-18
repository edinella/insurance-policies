const express = require('express');
const router = express.Router();
const errors = require('../errors');

router.get('/', (req, res, next) => {
  if (!req.user) {
    return next(new errors.UnauthorizedError());
  }
  res.json([]);
});

module.exports = router;
