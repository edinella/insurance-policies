const express = require('express');
const errors = require('../errors');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.token) {
    return next(new errors.UnauthorizedError());
  }
  res.json([]);
});

module.exports = router;
