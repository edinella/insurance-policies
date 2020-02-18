const supertest = require('supertest');
const app = require('../../lib/app');
const request = supertest(app);

describe('GET /policies', () => {
  it('should require authentication', async () => {
    const res = await request.get('/policies');
    expect(res.status).toBe(401);
  });
  // it('should return a JSON array', async () => {
  //   const res = await request.get('/policies');
  //   expect(res.status).toBe(200);
  //   expect(res.header['content-type']).toBe('application/json; charset=utf-8');
  //   expect(res.body instanceof Array).toBe(true);
  // });
});
