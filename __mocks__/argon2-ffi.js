module.exports = {
  argon2i: {
    verify,
    hash
  }
};

async function hash(buf, salt) {
  return Promise.resolve(`$argon2i$${buf}`);
}

async function verify(hashed, buf) {
  return Promise.resolve(hashed.replace('$argon2i$', '') === buf.toString());
}

// https://github.com/facebook/jest/issues/3552
