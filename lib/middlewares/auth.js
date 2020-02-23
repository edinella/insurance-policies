const expressJwt = require('express-jwt');
const errors = require('../errors');

const secret = process.env.JWT_SECRET;
const requestProperty = 'token';
const validateToken = expressJwt({ secret, requestProperty });

const useCustomError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return next(new errors.UnauthorizedError());
  }
  next();
};

module.exports = [validateToken, useCustomError];
