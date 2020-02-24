const expressJwt = require('express-jwt');
const errors = require('../errors');

const secret = process.env.JWT_SECRET;
const requestProperty = 'token';
const validateToken = expressJwt({ secret, requestProperty });

module.exports = (req, res, next) => {
  validateToken(req, res, err => {
    if (err && err.name === 'UnauthorizedError') {
      err = new errors.UnauthorizedError();
    }
    return next(err);
  });
};
