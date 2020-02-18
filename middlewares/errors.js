module.exports = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    err.status = 401;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
