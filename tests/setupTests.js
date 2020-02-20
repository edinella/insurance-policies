const sinon = require('sinon');

// https://mongoosejs.com/docs/jest.html
const time = {
  setTimeout: function() {
    return global.setTimeout.apply(global, arguments);
  }
};
require('sinon').stub(time, 'setTimeout');

// mocks mongoose
jest.mock('mongoose');
