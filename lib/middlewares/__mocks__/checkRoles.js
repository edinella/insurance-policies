const errors = require('../../errors');

const middleware = jest.fn((req, res, next) => {
  next(new errors.PermissionDeniedError());
});
module.exports = jest.fn(roles => middleware);
