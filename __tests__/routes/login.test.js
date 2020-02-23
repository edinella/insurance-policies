const supertest = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../lib/models');
const { Client } = require('../../lib/models');
const hash = require('../../lib/hash');
const app = supertest(require('../../lib/app'));

describe('GET /login', () => {
  it('should return a page', async () => {
    const res = await app.get('/');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  });
});
describe('POST /login', () => {
  it('missing credentials should return 400', async () => {
    const res = await app.post('/login');
    expect(res.status).toBe(400);
  });
  it('missing email should return 400', async () => {
    const res = await app.post('/login').send({ password: 'x' });
    expect(res.status).toBe(400);
  });
  it('missing password should return 400', async () => {
    const res = await app.post('/login').send({ email: 'x' });
    expect(res.status).toBe(400);
  });
  describe('with credentials,', () => {
    beforeAll(() => Client.base.connect());
    afterAll(() => Client.base.disconnect());
    beforeEach(async () => {
      const pwd = await hash.generate('a');
      const doc = new Client({ _id: 'a', email: 'a@a.a', pwd, role: 'user' });
      await doc.save();
    });
    afterEach(async () => await Client.deleteMany());
    it('with unknown email should return 401', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@b.c', password: 'x' });
      expect(res.status).toBe(401);
    });
    it('with wrong password should return 401', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@a.a', password: 'x' });
      expect(res.status).toBe(401);
    });
    it('with correct password should return 200 with a valid JWT token', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@a.a', password: 'a' });
      expect(res.status).toBe(200);
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.data.id).toBe('a');
      expect(decoded.data.role).toBe('user');
    });
  });
});
