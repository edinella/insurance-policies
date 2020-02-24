const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { Schema, Types } = mongoose;

mongoose.Promise = Promise;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const originalConnect = mongoose.connect;
mongoose.connect = async () => {
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString(true);
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  originalConnect.bind(mongoose)(mongoUri, options);

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      console.error(e);
    } else {
      throw e;
    }
  });

  mongoose.connection.once('open', () => {
    // console.log(`MongoDB successfully connected to ${mongoUri}`);
  });

  mongoose.connection.once('disconnected', () => {
    // console.log('MongoDB disconnected!');
    mongoServer.stop();
  });
};

module.exports = { mongoose, Schema, Types };
