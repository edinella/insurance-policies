const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
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
  if (!result) {
    return next(new errors.UnauthorizedError());
  }
  const { id, role } = doc;
  const payload = { data: { id, role } };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '2h'
  };
  const token = jwt.sign(payload, secret, options);
  return res.send({ token });
});

module.exports = router;
