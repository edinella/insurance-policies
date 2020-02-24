const { Schema } = require('mongoose');

const schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, lowercase: true },
  pwd: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'] }
});

module.exports = schema;
