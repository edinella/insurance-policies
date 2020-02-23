const express = require('express');
const errors = require('../errors');
const RangeHandler = require('../RangeHandler');
const auth = require('../middlewares/auth');
const checkRoles = require('../middlewares/checkRoles');
const { Client, Policy } = require('../models');

const router = express.Router();

router.get('/', auth, checkRoles(['admin']), async (req, res, next) => {
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
  res.json(
    docs.map(doc => {
      doc.id = doc._id;
      delete doc.__v;
      delete doc._id;
      return doc;
    })
  );
});

module.exports = router;
