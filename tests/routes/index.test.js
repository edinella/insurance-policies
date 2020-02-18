const supertest = require('supertest');
const app = require('../../lib/app');
const request = supertest(app);

describe('GET /', () => {
  it('should return a page', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  });
});

describe('GET /none', () => {
  it('should return 404', async () => {
    const res = await request.get('/none');
    expect(res.status).toBe(404);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  });
});
