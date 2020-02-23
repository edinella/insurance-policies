jest.mock('../../lib/models');

const supertest = require('supertest');
const { Client, Policy } = require('../../lib/models');
const hash = require('../../lib/hash');
const app = supertest(require('../../lib/app'));
let userToken;
let adminToken;
let login = async (email, password) => {
  return (await app.post('/login').send({ email, password })).body.token;
};

beforeAll(async () => {
  await Client.base.connect();
  await Client.insertMany([
    {
      _id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
      name: 'Britney',
      email: 'admin@a.a',
      role: 'admin',
      pwd: await hash.generate('adminPass')
    },
    {
      _id: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
      name: 'Manning',
      email: 'user@u.u',
      role: 'user',
      pwd: await hash.generate('userPass')
    }
  ]);
  await Policy.insertMany([
    {
      _id: '56b415d6-53ee-4481-994f-4bffa47b5239',
      clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
    },
    {
      _id: '64cceef9-3a01-49ae-a23b-3761b604800b',
      clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
    },
    {
      _id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b',
      clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
    }
  ]);
  userToken = await login('user@u.u', 'userPass');
  adminToken = await login('admin@a.a', 'adminPass');
});
afterAll(async () => {
  await Client.deleteMany();
  await Policy.deleteMany();
  await Client.base.disconnect();
});

describe('GET /policies/:id', () => {
  it('should get policy details', async () => {
    const res = await app
      .get('/policies/64cceef9-3a01-49ae-a23b-3761b604800b')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '64cceef9-3a01-49ae-a23b-3761b604800b',
      clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
    });
  });
});

describe('GET /policies/:id/client', () => {
  it('should get client details by policy id', async () => {
    const res = await app
      .get('/policies/64cceef9-3a01-49ae-a23b-3761b604800b/client')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
      name: 'Manning',
      email: 'user@u.u',
      role: 'user'
    });
  });
});

describe('GET /policies', () => {
  it('should respond 401 without credentials', async () => {
    const res = await app.get('/policies');
    expect(res.status).toBe(401);
  });
  it('should respond 403 to "user" role user', async () => {
    const res = await app
      .get('/policies')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
  it('should list array of policies', async () => {
    const res = await app
      .get('/policies')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
        id: '56b415d6-53ee-4481-994f-4bffa47b5239'
      },
      {
        clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
        id: '64cceef9-3a01-49ae-a23b-3761b604800b'
      },
      {
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b'
      }
    ]);
  });
  it('should filter by clientName', async () => {
    const res = await app
      .get('/policies?clientName=Manning')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: '56b415d6-53ee-4481-994f-4bffa47b5239',
        clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
      },
      {
        id: '64cceef9-3a01-49ae-a23b-3761b604800b',
        clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb'
      }
    ]);
  });
  it('should filter by clientEmail', async () => {
    const res = await app
      .get('/policies?clientEmail=admin@a.a')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b',
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
      }
    ]);
  });
  it('should filter by clientId', async () => {
    const res = await app
      .get('/policies?clientId=a0ece5db-cd14-4f21-812f-966633e7be86')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b',
        clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86'
      }
    ]);
  });
});
