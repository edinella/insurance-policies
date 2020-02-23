const hash = require('../lib/hash');

describe('hash', () => {
  it('.generate should generate an argon2i hash', async () => {
    const h = await hash.generate('a');
    expect(/^\$argon2i\$/.test(h)).toBe(true);
  });
  it('.verify should validate an previous generated hash', async () => {
    const h = await hash.generate('passwd');
    const r = await hash.verify(h, 'passwd');
    expect(r).toBe(true);
  });
  it('.verify should fail validation if password is diffrent', async () => {
    const h = await hash.generate('passwd');
    const r = await hash.verify(h, 'passwd2');
    expect(r).toBe(false);
  });
});
