const mongoose = require('mongoose');
const debug = require('debug')('policy-service:models');
const requireDirectory = require('require-directory');

module.exports = requireDirectory(module, { recurse: false });

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const options = {
  keepAlive: 300000,
  connectTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
};
const user = process.env.MONGO_USERNAME;
const pwd = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DATABASE;
const host = process.env.MONGO_HOST;
const DBURI = `mongodb://${user}:${pwd}@${host}:27017/${dbName}`;

mongoose.connect(DBURI, options);

mongoose.connection.on('connected', function() {
  debug('Mongoose connected');
});

mongoose.connection.on('open', function() {
  debug('Mongoose connection is open');
});

mongoose.connection.on('disconnected', function() {
  debug('Mongoose has disconnected');
  // debug('Mongoose is reconnecting...');
  // mongoose.connection.close(function() {
  //   mongoose.connect(DBURI, options);
  // });
});

mongoose.connection.on('error', function(err) {
  debug('Mongoose connection error');
  debug(err);
});
