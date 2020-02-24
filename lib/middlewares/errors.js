module.exports = (err, req, res, next) => {
  if (req.app.get('env') === 'development' && err.status === undefined) {
    console.error(err);
  }
  res.status(err.status || 500);
  res.send(err.message);
};
