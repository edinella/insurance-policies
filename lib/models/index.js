const mongoose = require('mongoose');

const Client = mongoose.model('Client', require('./clientSchema'));
const Policy = mongoose.model('Policy', require('./policySchema'));

module.exports = { Client, Policy };
