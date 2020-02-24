const express = require('express');
const RangeHandler = require('../RangeHandler');
const auth = require('../middlewares/auth');
const checkRoles = require('../middlewares/checkRoles');
const { Client } = require('../models');
const errors = require('../errors');
const leanize = require('../leanize');

const router = express.Router();
const allowed = checkRoles(['user', 'admin']);

// Get a clients by id
router.get('/:id', auth, allowed, async (req, res, next) => {
  const doc = await Client.findOne({ _id: req.params.id }).lean();
  if (!doc) {
    return next(errors.NotFoundError());
  }
  res.json(leanize(doc));
});

// Get clients list filtered by name
router.get('/', auth, allowed, async (req, res, next) => {
  let clientConditions = {};

  // check filters
  const { name } = req.query;
  if (name !== undefined) {
    clientConditions.name = name;
  }

  // find clients (paginated)
  const rangeHandler = new RangeHandler(req, res);
  const range = rangeHandler.getRange();
  const docs = await Client.find(clientConditions)
    .sort({ _id: range.reverse ? -1 : 1 })
    .skip(range.skip)
    .limit(range.limit)
    .lean();

  // format and send result (paginated)
  range.send(docs.length);
  res.json(docs.map(leanize));
});

module.exports = router;
