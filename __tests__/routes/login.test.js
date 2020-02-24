jest.mock('../../lib/models');

const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const { Client } = require('../../lib/models');
const hash = require('../../lib/hash');
const app = supertest(require('../../lib/app'));

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
    beforeAll(async () => {
      await Client.base.connect();
      const pwd = await hash.generate('a');
      const doc = new Client({ _id: 'a', email: 'a@a.a', pwd, role: 'user' });
      await doc.save();
    });
    afterAll(async () => {
      await Client.deleteMany();
      await Client.base.disconnect();
    });
    it('with unknown email should return 400', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@b.c', password: 'x' });
      expect(res.status).toBe(400);
    });
    it('with wrong password should return 400', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@a.a', password: 'x' });
      expect(res.status).toBe(400);
    });
    it('with correct password should return 200 with a valid JWT token', async () => {
      const res = await app
        .post('/login')
        .send({ email: 'a@a.a', password: 'a' });
      expect(res.status).toBe(200);
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('a');
      expect(decoded.role).toBe('user');
    });
  });
});
