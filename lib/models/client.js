const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, lowercase: true },
  pwd: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'] }
});

const Client = mongoose.model('Client', schema);
module.exports = Client;
