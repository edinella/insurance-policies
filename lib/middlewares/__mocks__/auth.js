const errors = require('../../errors');

module.exports = jest.fn((req, res, next) => {
  next(new errors.UnauthorizedError());
});
