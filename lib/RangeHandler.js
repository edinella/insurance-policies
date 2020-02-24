const errors = require('./errors');

module.exports = RangeHandler;

function RangeHandler(req, res, type) {
  this.req = req;
  this.res = res;
  this.type = type || 'items';
  this.accept = [this.type];
  this.ranges = [];
  this.parse(this.req.headers.range);
}

RangeHandler.prototype.parse = function(range) {
  if (typeof range === 'string') {
    range = range.split('=');
    if (range.length !== 2) {
      this.notSatisfiable();
    }
    this.type = range[0];
    var isMultiple = !!~range[1].indexOf(',');
    var parseRange = this.parseRange.bind(this);
    this.ranges = this.ranges.concat(
      isMultiple ? range[1].split(',').map(parseRange) : [parseRange(range[1])]
    );
  }
};

RangeHandler.prototype.parseRange = function(str) {
  var range = new Range(this);
  range.fromStr(str);
  return range;
};

RangeHandler.prototype.getRange = function(i) {
  return this.ranges[i || 0] || new Range(this);
};

RangeHandler.prototype.notSatisfiable = function() {
  throw new errors.RequestedRangeNotSatisfiableError();
};

RangeHandler.prototype.send = function(start, end, total) {
  this.res.set('Accept-Ranges', this.accept);
  this.res.status(this.ranges.length ? 206 : 200);
  total = total || '*';
  var range = start + '-' + end + '/' + total;
  this.res.set('Content-Range', this.type + ' ' + range);
};

function Range(handler) {
  // this.start;
  // this.end;
  this.handler = handler;
  this.skip = 0;
  this.limit = 1000;
  this.reverse = false;
}

Range.prototype.fromStr = function(str) {
  var matches = (str || '').match(/^(\d*)-(\d*)$/);
  if (!matches) {
    this.handler.notSatisfiable();
  }
  var start = parseInt(matches[1], 10);
  var end = parseInt(matches[2], 10);
  var hasStart = !isNaN(start);
  var hasEnd = !isNaN(end);
  if (!hasStart && !hasEnd) {
    this.handler.notSatisfiable();
  }
  if (hasStart) {
    this.start = start;
    this.skip = start;
  }
  if (hasEnd) {
    this.end = end;
  }
  if (hasStart && hasEnd) {
    this.limit = end + 1 - start;
  }
  if (!hasStart && hasEnd) {
    this.reverse = true;
    this.limit = end;
  }
  if (this.limit < 1) {
    this.handler.notSatisfiable();
  }
};

Range.prototype.send = function(qty, total) {
  // TODO: start & end should handle reverse range
  if (this.skip && !qty) {
    this.handler.notSatisfiable();
  }
  this.handler.send(this.skip, this.skip - 1 + qty, total);
};
