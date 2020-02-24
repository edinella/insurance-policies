jest.mock('../../lib/models');
jest.mock('../../lib/middlewares/auth');

const supertest = require('supertest');
const { Client } = require('../../lib/models');
const auth = require('../../lib/middlewares/auth');
const app = supertest(require('../../lib/app'));

beforeAll(async () => {
  await Client.base.connect();
  await Client.insertMany([
    { _id: 'C1', name: 'Name A', email: 'a@mail', role: 'admin', pwd: 'x' },
    { _id: 'C2', name: 'Name B', email: 'b@mail', role: 'user', pwd: 'x' }
  ]);
});
afterAll(async () => {
  await Client.deleteMany();
  await Client.base.disconnect();
});

const authWithRole = role => (req, res, next) => {
  req.token = { role };
  next();
};

describe('GET /clients/:id', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/clients/1');
    expect(res.status).toBe(401);
  });
  it('should respond 403 if role is not "user" or "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('mistery'));
    const res = await app.get('/clients/1');
    expect(res.status).toBe(403);
  });
  it('should not respond 403 if role is "user"', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/clients/1');
    expect(res.status).not.toBe(403);
  });
  it('should not respond 403 if role is "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/clients/1');
    expect(res.status).not.toBe(403);
  });
  it('should handle 404', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/clients/none');
    expect(res.status).toBe(404);
  });
  it('should get client details', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/clients/C2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'C2',
      name: 'Name B',
      email: 'b@mail',
      role: 'user'
    });
  });
});

describe('GET /clients', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/clients');
    expect(res.status).toBe(401);
  });
  it('should respond 403 if role is not "user" or "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('mistery'));
    const res = await app.get('/clients');
    expect(res.status).toBe(403);
  });
  it('should not respond 403 if role is "user"', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/clients');
    expect(res.status).not.toBe(403);
  });
  it('should not respond 403 if role is "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/clients');
    expect(res.status).not.toBe(403);
  });
  it('should get a list of clients', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/clients');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 'C1', name: 'Name A', email: 'a@mail', role: 'admin' },
      { id: 'C2', name: 'Name B', email: 'b@mail', role: 'user' }
    ]);
  });
  it('should get a list of clients filtered by name', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/clients?name=Name%20B');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 'C2', name: 'Name B', email: 'b@mail', role: 'user' }
    ]);
  });
});
