const util = require('util');
const http = require('http');

exports.BadRequestError = BadRequestError;
exports.NotFoundError = NotFoundError;
exports.RequestedRangeNotSatisfiableError = RequestedRangeNotSatisfiableError;
exports.PermissionDeniedError = PermissionDeniedError;
exports.UnauthorizedError = UnauthorizedError;
exports.ValidationError = ValidationError;
exports.ValidatorError = ValidatorError;
exports.ConflictError = ConflictError;
exports.AuthError = AuthError;

// request bounce
util.inherits(BadRequestError, Error);
function BadRequestError(message, status) {
  status = status || 400;
  message = message || http.STATUS_CODES[status];
  Error.call(this, message);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = status;
  this.message = message;
}

// not found bounce
util.inherits(NotFoundError, BadRequestError);
function NotFoundError() {
  BadRequestError.call(this, http.STATUS_CODES[404], 404);
}

// requested range not satisfiable bounce
util.inherits(RequestedRangeNotSatisfiableError, BadRequestError);
function RequestedRangeNotSatisfiableError() {
  BadRequestError.call(this, http.STATUS_CODES[416], 416);
}

// validation request bounce
util.inherits(ValidationError, BadRequestError);
function ValidationError(validatorErrorsMap) {
  BadRequestError.call(this, 'Validation failed');
  this.errors = validatorErrorsMap;
}

// authentication bounce
util.inherits(AuthError, BadRequestError);
function AuthError() {
  const message = 'Authorization has been refused for those credentials';
  BadRequestError.call(this, message);
}

// authentication bounce
util.inherits(UnauthorizedError, BadRequestError);
function UnauthorizedError() {
  const message = 'The request requires user authentication';
  BadRequestError.call(this, message, 401);
}

// permission bounce
util.inherits(PermissionDeniedError, BadRequestError);
function PermissionDeniedError(action) {
  action = action || 'this action';
  const message = `This user has permission denied to ${action}`;
  BadRequestError.call(this, message, 403);
}

// conflict bounce
util.inherits(ConflictError, BadRequestError);
function ConflictError(message) {
  const defaultMessage =
    'The request could not be completed due to a conflict' +
    ' with the current state of the resource';
  BadRequestError.call(this, message || defaultMessage, 409);
}

// field validation error, sent inside ValidationError
util.inherits(ValidatorError, Error);
function ValidatorError(type, message, path, value) {
  Error.call(this, message);
  this.type = type;
  this.message = message;
  this.value = value;
  this.path = path;
}
