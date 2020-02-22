const expressJwt = require('express-jwt');
const errors = require('../errors');

const secret = process.env.JWT_SECRET;
const validateToken = expressJwt({ secret });

const useCustomError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return next(new errors.UnauthorizedError());
  }
  next();
};

module.exports = [validateToken, useCustomError];
