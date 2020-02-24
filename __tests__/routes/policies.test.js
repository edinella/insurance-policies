jest.mock('../../lib/models');
jest.mock('../../lib/middlewares/auth');

const supertest = require('supertest');
const { Client, Policy } = require('../../lib/models');
const auth = require('../../lib/middlewares/auth');
const app = supertest(require('../../lib/app'));

beforeAll(async () => {
  await Client.base.connect();
  await Client.insertMany([
    { _id: 'C1', name: 'N1', email: '1@mail', role: 'admin', pwd: 'x' },
    { _id: 'C2', name: 'N2', email: '2@mail', role: 'user', pwd: 'x' }
  ]);
  await Policy.insertMany([
    { _id: 'P1', clientId: 'C2' },
    { _id: 'P2', clientId: 'C2' },
    { _id: 'P3', clientId: 'C1' }
  ]);
});
afterAll(async () => {
  await Client.deleteMany();
  await Policy.deleteMany();
  await Client.base.disconnect();
});

const authWithRole = role => (req, res, next) => {
  req.token = { role };
  next();
};

describe('GET /policies/:id', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/policies/1');
    expect(res.status).toBe(401);
  });
  it('should respond 403 if role doesn`t matches', async () => {
    auth.mockImplementationOnce(authWithRole('mistery'));
    const res = await app.get('/policies/1');
    expect(res.status).toBe(403);
  });
  it('should respond 403 if role is "user"', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/policies/1');
    expect(res.status).toBe(403);
  });
  it('should not respond 403 if role is "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies/1');
    expect(res.status).not.toBe(403);
  });
  it('should get policy details', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies/P2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'P2', clientId: 'C2' });
  });
});

describe('GET /policies/:id/client', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/policies/P1/client');
    expect(res.status).toBe(401);
  });
  it('should respond 403 if role doesn`t matches', async () => {
    auth.mockImplementationOnce(authWithRole('mistery'));
    const res = await app.get('/policies/P1/client');
    expect(res.status).toBe(403);
  });
  it('should respond 403 if role is "user"', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/policies/P1/client');
    expect(res.status).toBe(403);
  });
  it('should not respond 403 if role is "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies/P1/client');
    expect(res.status).not.toBe(403);
  });
  it('should get client details by policy id', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies/P2/client');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'C2',
      name: 'N2',
      email: '2@mail',
      role: 'user'
    });
  });
});

describe('GET /policies', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/policies');
    expect(res.status).toBe(401);
  });
  it('should respond 403 if role doesn`t matches', async () => {
    auth.mockImplementationOnce(authWithRole('mistery'));
    const res = await app.get('/policies');
    expect(res.status).toBe(403);
  });
  it('should respond 403 if role is "user"', async () => {
    auth.mockImplementationOnce(authWithRole('user'));
    const res = await app.get('/policies');
    expect(res.status).toBe(403);
  });
  it('should not respond 403 if role is "admin"', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies');
    expect(res.status).not.toBe(403);
  });
  it('should list array of policies', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { clientId: 'C2', id: 'P1' },
      { clientId: 'C2', id: 'P2' },
      { clientId: 'C1', id: 'P3' }
    ]);
  });
  it('should filter by clientName', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies?clientName=N2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 'P1', clientId: 'C2' },
      { id: 'P2', clientId: 'C2' }
    ]);
  });
  it('should filter by clientEmail', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies?clientEmail=1@mail');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'P3', clientId: 'C1' }]);
  });
  it('should filter by clientId', async () => {
    auth.mockImplementationOnce(authWithRole('admin'));
    const res = await app.get('/policies?clientId=C1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'P3', clientId: 'C1' }]);
  });
});
