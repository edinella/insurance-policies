const mongoose = require('mongoose');
const express = require('express');
const errors = require('../errors');
const hash = require('../hash');

const router = express.Router();
const Client = mongoose.model('Client');

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new errors.BadRequestError('Credentials needed: email, password')
    );
  }
  const doc = await Client.findOne({ email: email });
  if (!doc) {
    return next(new errors.UnauthorizedError());
  }
  const result = await hash.verify(doc.pwd, password);
  if (result) {
    return res.sendStatus(200);
  } else {
    return next(new errors.UnauthorizedError());
  }
});

module.exports = router;
