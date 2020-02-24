const express = require('express');
const RangeHandler = require('../RangeHandler');
const auth = require('../middlewares/auth');
const checkRoles = require('../middlewares/checkRoles');
const { Client, Policy } = require('../models');
const errors = require('../errors');
const leanize = require('../leanize');

const router = express.Router();
const allowed = checkRoles(['admin']);

// list policies
router.get('/', auth, allowed, async (req, res, next) => {
  let policyConditions = {};
  let clientConditions = {};

  // check filters
  const { clientName, clientId, clientEmail } = req.query;
  if (clientId !== undefined) {
    policyConditions.clientId = clientId;
  }
  if (clientName !== undefined) {
    clientConditions.name = clientName;
  }
  if (clientEmail !== undefined) {
    clientConditions.email = clientEmail;
  }

  // apply filters
  if (Object.keys(clientConditions).length && !policyConditions.clientId) {
    let clients = await Client.find(clientConditions)
      .select('_id')
      .lean();
    clients = clients.map(doc => doc._id);
    policyConditions.clientId = { $in: clients };
  }

  // find policies (paginated)
  const rangeHandler = new RangeHandler(req, res);
  const range = rangeHandler.getRange();
  const docs = await Policy.find(policyConditions)
    .sort({ _id: range.reverse ? -1 : 1 })
    .skip(range.skip)
    .limit(range.limit)
    .lean();

  // format and send result (paginated)
  range.send(docs.length);
  res.json(docs.map(leanize));
});

// get policy by id
router.get('/:id', auth, allowed, async (req, res, next) => {
  const doc = await Policy.findOne({ _id: req.params.id }).lean();
  if (!doc) {
    return next(errors.NotFoundError());
  }
  res.json(leanize(doc));
});

// get client from policy by id
router.get('/:id/client', auth, allowed, async (req, res, next) => {
  let policy = await Policy.findOne({ _id: req.params.id })
    .select('clientId')
    .lean();
  if (!policy) {
    return next(errors.NotFoundError());
  }
  let doc = await Client.findOne({ _id: policy.clientId }).lean();
  if (!doc) {
    return next(errors.NotFoundError());
  }
  res.json(leanize(doc));
});

module.exports = router;
