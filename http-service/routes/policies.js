var express = require('express');
var router = express.Router();

router.get('/policies', function(req, res, next) {
  res.send('respond with policies');
});

module.exports = router;
