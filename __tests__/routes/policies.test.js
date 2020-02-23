jest.useFakeTimers();
jest.mock('mongoose');
const app = require('supertest')(require('../../lib/app'));

describe('GET /policies', () => {
  it('should require authentication', async () => {
    const res = await app.get('/policies');
    expect(res.status).toBe(401);
  });
});
