const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const errors = require('../errors');
const hash = require('../hash');

const router = express.Router();
const Client = mongoose.model('Client');

router.post('/', async (req, res, next) => {
  // get credentials
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new errors.BadRequestError('Credentials needed: email, password')
    );
  }

  // get client from database
  const doc = await Client.findOne({ email: email });
  if (!doc) {
    return next(new errors.AuthError());
  }

  // check if password hash matches
  const result = await hash.verify(doc.pwd, password);
  if (!result) {
    return next(new errors.AuthError());
  }

  // generate and send token
  const { id, role } = doc;
  const payload = { id, role };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '2h' };
  const token = jwt.sign(payload, secret, options);
  return res.send({ token });
});

module.exports = router;
