const { promisify } = require('util');
const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');

const randomBytes = promisify(crypto.randomBytes);

exports.generate = str => randomBytes(32).then(salt => argon2i.hash(str, salt));
exports.verify = (hash, pass) => argon2i.verify(hash, new Buffer.from(pass));
