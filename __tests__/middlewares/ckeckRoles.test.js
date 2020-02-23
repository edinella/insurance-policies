const checkRoles = require('../../lib/middlewares/checkRoles');

describe('checkRoles middleware', () => {
  it('should respond 401 without a token', done => {
    const req = {};
    const res = {};
    checkRoles(['guacamole'])(req, res, err => {
      expect(err.status).toBe(401);
      done();
    });
  });
  it('should respond 401 if token has no matching role', done => {
    const req = { token: { role: 'avocado' } };
    const res = {};
    checkRoles(['tomato', 'guacamole'])(req, res, err => {
      expect(err.status).toBe(403);
      done();
    });
  });
  it('should go on if role is matching', done => {
    const req = { token: { role: 'guacamole' } };
    const res = {};
    checkRoles(['tomato', 'guacamole', 'avocado'])(req, res, err => {
      expect(err).toBe(undefined);
      done();
    });
  });
});
