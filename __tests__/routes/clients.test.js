jest.mock('../../lib/models');
jest.mock('../../lib/middlewares/auth');
jest.mock('../../lib/middlewares/checkRoles');

const supertest = require('supertest');
const { Client } = require('../../lib/models');
const auth = require('../../lib/middlewares/auth');
const checkRoles = require('../../lib/middlewares/checkRoles');
const app = supertest(require('../../lib/app'));
const checkRolesMiddleware = checkRoles();

beforeAll(async () => {
  await Client.base.connect();
  await Client.insertMany([
    { _id: 'ID1', name: 'Name A', email: 'a@mail', role: 'admin', pwd: 'x' },
    { _id: 'ID2', name: 'Name B', email: 'b@mail', role: 'user', pwd: 'x' }
  ]);
});
afterAll(async () => {
  await Client.deleteMany();
  await Client.base.disconnect();
});

describe('GET /clients/:id', () => {
  it('should use auth middleware', async () => {
    const res = await app.get('/clients/1');
    expect(auth).toHaveBeenCalled();
    expect(res.status).toBe(401);
  });
  it('should use checkRoles middleware', async () => {
    auth.mockImplementationOnce((req, res, next) => next());
    const res = await app.get('/clients/1');
    expect(checkRolesMiddleware).toHaveBeenCalled();
    expect(res.status).toBe(403);
  });
  describe('with credentials', () => {
    beforeEach(() => {
      auth.mockImplementationOnce((req, res, next) => next());
      checkRolesMiddleware.mockImplementationOnce((req, res, next) => next());
    });
    it('should handle 404', async () => {
      const res = await app.get('/clients/none');
      expect(res.status).toBe(404);
    });
    it('should get client details', async () => {
      const res = await app.get('/clients/ID2');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 'ID2',
        name: 'Name B',
        email: 'b@mail',
        role: 'user'
      });
    });
  });
});

describe('GET /clients', () => {
  it('should use auth middleware', async () => {
    const res = await app.get('/clients');
    expect(auth).toHaveBeenCalled();
    expect(res.status).toBe(401);
  });
  it('should use checkRoles middleware', async () => {
    auth.mockImplementationOnce((req, res, next) => next());
    const res = await app.get('/clients');
    expect(checkRolesMiddleware).toHaveBeenCalled();
    expect(res.status).toBe(403);
  });
  describe('with credentials', () => {
    beforeEach(() => {
      auth.mockImplementationOnce((req, res, next) => next());
      checkRolesMiddleware.mockImplementationOnce((req, res, next) => next());
    });
    it('should get list of clients', async () => {
      const res = await app.get('/clients');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 'ID1', name: 'Name A', email: 'a@mail', role: 'admin' },
        { id: 'ID2', name: 'Name B', email: 'b@mail', role: 'user' }
      ]);
    });
    it('should get list of clients filtered by name', async () => {
      const res = await app.get('/clients?name=Name%20B');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 'ID2', name: 'Name B', email: 'b@mail', role: 'user' }
      ]);
    });
  });
});
