require('../setupTests');
const app = require('supertest')(require('../../lib/app'));

describe('GET /policies', () => {
  it('should require authentication', done => {
    app.get('/policies').expect(401, done);
  });
});
