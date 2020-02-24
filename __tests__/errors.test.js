const http = require('http');
const errors = require('../lib/errors');

describe('errors.BadRequestError', () => {
  it('should have default status 400 and correspondent message', async () => {
    const err = new errors.BadRequestError();
    expect(err.status).toBe(400);
    expect(err.message).toBe(http.STATUS_CODES[400]);
  });
  it('should override message and status', async () => {
    const err = new errors.BadRequestError('No donuts for ya', 404);
    expect(err.status).toBe(404);
  });
});
describe('errors.NotFoundError', () => {
  it('should have default status 404 and correspondent message', async () => {
    const err = new errors.NotFoundError();
    expect(err.status).toBe(404);
    expect(err.message).toBe(http.STATUS_CODES[404]);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.NotFoundError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.RequestedRangeNotSatisfiableError', () => {
  it('should have default status 416 and correspondent message', async () => {
    const err = new errors.RequestedRangeNotSatisfiableError();
    expect(err.status).toBe(416);
    expect(err.message).toBe(http.STATUS_CODES[416]);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.RequestedRangeNotSatisfiableError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.ValidationError', () => {
  it('should contain a map of errors', async () => {
    const map = [1, 2];
    const err = new errors.ValidationError(map);
    expect(err.message).toBe('Validation failed');
    expect(err.errors).toBe(map);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.ValidationError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.AuthError', () => {
  it('should have default status 400', async () => {
    const err = new errors.AuthError();
    expect(err.status).toBe(400);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.AuthError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.UnauthorizedError', () => {
  it('should have default status 401', async () => {
    const err = new errors.UnauthorizedError();
    expect(err.status).toBe(401);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.UnauthorizedError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.PermissionDeniedError', () => {
  it('should have default status 403 and message', async () => {
    const err = new errors.PermissionDeniedError();
    expect(err.status).toBe(403);
    expect(err.message).toBe('This user has permission denied to this action');
  });
  it('should apply custom action', async () => {
    const err = new errors.PermissionDeniedError('x');
    expect(err.message).toBe('This user has permission denied to x');
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.PermissionDeniedError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.ConflictError', () => {
  it('should have default status 409', async () => {
    const err = new errors.ConflictError();
    expect(err.status).toBe(409);
  });
  it('should extend BadRequestError', async () => {
    const err = new errors.ConflictError();
    expect(err instanceof errors.BadRequestError).toBe(true);
  });
});
describe('errors.ValidatorError', () => {
  it('should not have status', async () => {
    const err = new errors.ValidatorError();
    expect(err.status).toBe(undefined);
  });
  it('should extend Error', async () => {
    const err = new errors.ValidatorError();
    expect(err instanceof Error).toBe(true);
  });
});
