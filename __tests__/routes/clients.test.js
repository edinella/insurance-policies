jest.useFakeTimers();
jest.mock('mongoose');
const app = require('supertest')(require('../../lib/app'));

describe('GET /clients', () => {
  it('should require authentication', done => {
    app.get('/clients').expect(401, done);
  });
});
