const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const auth = require('../../lib/middlewares/auth');

describe('auth middleware', () => {
  it('should respond 401 without authorization header', done => {
    const req = {};
    const res = {};
    auth(req, res, err => {
      expect(err.status).toBe(401);
      done();
    });
  });
  it('should respond 401 with invalid token', done => {
    const token = 'NOOOO';
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    auth(req, res, err => {
      expect(err.status).toBe(401);
      done();
    });
  });
  it('should decode token and store it at "req.token"', done => {
    const payload = { id: 'a', role: 'user' };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '2h' };
    const token = jwt.sign(payload, secret, options);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    auth(req, res, err => {
      expect(err).toBe(undefined);
      expect(req.token.id).toBe('a');
      expect(req.token.role).toBe('user');
      done();
    });
  });
  it('should respond 401 with expired token', done => {
    const payload = { iat: Math.floor(Date.now() / 1000) - 30 };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1s' };
    const token = jwt.sign(payload, secret, options);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    auth(req, res, err => {
      expect(err.status).toBe(401);
      done();
    });
  });
});
