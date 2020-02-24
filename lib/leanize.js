module.exports = doc => {
  doc.id = doc._id;
  delete doc.__v;
  delete doc._id;
  delete doc.pwd;
  return doc;
};
