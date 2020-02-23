const { Schema } = require('mongoose');

const schema = new Schema({
  _id: { type: String, required: true },
  amountInsured: { type: Number },
  email: { type: String, lowercase: true },
  inceptionDate: { type: Date },
  installmentPayment: { type: Boolean },
  clientId: { type: String, required: true }
});

module.exports = schema;
