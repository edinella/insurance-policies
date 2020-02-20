require('../setupTests');
const app = require('supertest')(require('../../lib/app'));

describe('GET /', () => {
  it('should return a page', async () => {
    const res = await app.get('/');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  });
});

describe('GET /void', () => {
  it('should return 404', async () => {
    const res = await app.get('/void');
    expect(res.status).toBe(404);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
  });
});
