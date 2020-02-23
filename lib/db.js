const mongoose = require('mongoose');
require('../lib/models');

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
  console.log('Mongoose connected');
});

mongoose.connection.on('open', function() {
  console.log('Mongoose connection is open');
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose has disconnected');
  // console.log('Mongoose is reconnecting...');
  // mongoose.connection.close(function() {
  //   mongoose.connect(DBURI, options);
  // });
});

mongoose.connection.on('error', function(err) {
  console.error('Mongoose connection error');
  console.error(err);
});
