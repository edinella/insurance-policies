const debug = require('debug')('insurance-policies:seed-data');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('../lib/models');

main()
  .then(v => console.log('SEED DONE'))
  .catch(err => console.error(err));

async function main() {
  const entities = [
    ['Policy', 'policies.json'],
    ['Client', 'clients.json']
  ].map(args => seed(...args));
  return Promise.all(entities);
}

async function seed(modelName, fileName) {
  const Model = mongoose.model(modelName);
  const doc = await Model.findOne({});
  if (!doc) {
    debug(`${modelName} will be seeded`);
    const arr = JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));
    const docs = arr.map(doc => {
      doc._id = doc.id;
      return doc;
    });
    const result = Model.insertMany(docs);
    debug(`${modelName} seeded`);
    return result;
  } else {
    debug(`${modelName} already seeded`);
  }
}
