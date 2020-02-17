const debug = require("debug")("insurance-policies:seed-data");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("../models");

const Policy = mongoose.model("Policy");
const policiesData = path.join(__dirname, "policies.json");

// ckeck if data is already loaded
Policy.findOne({}, (err, doc) => {
  if (err) {
    throw err;
  }
  if (!doc) {
    loadInitialData();
  }
  debug("DONE");
});

// loads data
function loadInitialData() {
  const rawdata = fs.readFileSync(policiesData);
  const arr = JSON.parse(rawdata);
  const docs = arr.map(doc => {
    doc._id = doc.id;
    return doc;
  });
  Policy.insertMany(docs, function(err, docs) {
    if (err) {
      throw err;
    }
    debug("DATA LOADED");
  });
}
