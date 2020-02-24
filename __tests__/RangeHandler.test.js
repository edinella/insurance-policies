const RangeHandler = require('../lib/RangeHandler');

describe('RangeHandler', () => {
  it('should get type and limits', async () => {
    const res = {};
    const req = { headers: { range: 'beers=0-9' } };
    const rangeHandler = new RangeHandler(req, res);
    const range = rangeHandler.getRange();
    expect(rangeHandler.type).toBe('beers');
    expect(range.skip).toBe(0);
    expect(range.limit).toBe(10);
  });
  it('should validate basic format', async () => {
    const res = {};
    const req = { headers: { range: 'avocados' } };
    try {
      const rangeHandler = new RangeHandler(req, res);
    } catch (err) {
      expect(err.status).toBe(416);
    }
  });
});
