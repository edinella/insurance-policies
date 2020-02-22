const express = require('express');
const errors = require('../errors');
const auth = require('../middlewares/auth');
const checkRoles = require('../middlewares/checkRoles');

const router = express.Router();

router.get('/', auth, checkRoles(['user']), (req, res, next) => {
  res.json([]);
});

module.exports = router;
