const mongoose = require('mongoose');
const { promisify } = require('util');
const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('../lib/models');

const randomBytes = promisify(crypto.randomBytes);

main()
  .then(v => console.log('SEED DONE'))
  .catch(err => console.error(err));

async function main() {
  return Promise.all([seedPolicies(), seedClients()]);
}

async function seedPolicies() {
  const Policy = mongoose.model('Policy');
  const doc = await Policy.findOne({});
  if (!doc) {
    console.log('Started seeding Policy');
    const filePath = path.join(__dirname, 'policies.json');
    const arr = JSON.parse(fs.readFileSync(filePath));
    const docs = arr.map(doc => {
      doc._id = doc.id;
      return doc;
    });
    const result = Policy.insertMany(docs);
    console.log('Finished seeding Policy');
    return result;
  } else {
    console.log('No need for seeding Policy');
  }
}

async function seedClients() {
  const Client = mongoose.model('Client');
  const doc = await Client.findOne({});
  if (!doc) {
    console.log('Started seeding Client');
    const filePath = path.join(__dirname, 'clients.json');
    const arr = JSON.parse(fs.readFileSync(filePath));
    const docs = await Promise.all(
      arr.map(async doc => {
        doc._id = doc.id;

        // for this example, the password will be the username of email
        const pwd = doc.email.split('@')[0];
        doc.pwd = await randomBytes(32).then(salt => argon2i.hash(pwd, salt));
        return doc;
      })
    );
    const result = Client.insertMany(docs);
    console.log('Finished seeding Client');
    return result;
  } else {
    console.log('No need for seeding Client');
  }
}
