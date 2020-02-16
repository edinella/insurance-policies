const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

describe('GET /clients', () => {
  it('should return a JSON array', async () => {
    const res = await request.get('/clients');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body instanceof Array).toBe(true);
  });
});
