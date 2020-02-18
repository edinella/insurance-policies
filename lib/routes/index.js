const argon2i = require('argon2-ffi').argon2i;
const mongoose = require('mongoose');
const express = require('express');
const errors = require('../errors');

const router = express.Router();
const Client = mongoose.model('Client');

router.get('/', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Welcome!' });
  } else {
    res.redirect('/login');
  }
});

router.post('/login', async (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return next(
      new errors.BadRequestError('Credentials needed: email, password')
    );
  }
  const doc = await Client.findOne({ email: req.body.email });
  if (!doc) {
    return next(new errors.UnauthorizedError());
  }

  argon2i.verify(doc.pwd, req.body.password, function(err) {
    if (err) {
      return next(new errors.UnauthorizedError());
    }
    return res.status(200).send('Welcome!', doc);
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
