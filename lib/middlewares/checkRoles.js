const errors = require('../errors');

module.exports = roles => (req, res, next) => {
  if (!req.token) {
    return next(new errors.UnauthorizedError());
  }
  if (roles.indexOf(req.token.role) === -1) {
    return next(new errors.PermissionDeniedError());
  }
  return next();
};
