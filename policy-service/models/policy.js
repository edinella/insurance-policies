const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: { type: String, required: true },
  amountInsured: { type: Number },
  email: { type: String, required: true, lowercase: true },
  inceptionDate: { type: Date },
  installmentPayment: { type: Boolean },
  clientId: { type: String, required: true }
});

const Policy = mongoose.model('Policy', schema);
module.exports = Policy;
