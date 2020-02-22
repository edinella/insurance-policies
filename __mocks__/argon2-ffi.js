module.exports = {
  argon2i: {
    verify,
    hash
  }
};

async function hash(buf, salt) {
  return Promise.resolve(buf);
}

async function verify(hashed, buf) {
  return Promise.resolve(hashed === buf.toString());
}

// https://github.com/facebook/jest/issues/3552
