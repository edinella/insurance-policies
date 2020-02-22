const errors = require('../errors');

module.exports = roles => (req, res, next) => {
  if (!req.user) {
    return next(new errors.UnauthorizedError());
  }
  if (roles.indexOf(req.user.role) === -1) {
    return next(new errors.PermissionDeniedError());
  }
  return next();
};
