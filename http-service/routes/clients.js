var express = require('express');
var router = express.Router();

router.get('/clients', function(req, res, next) {
  res.send('respond with clients');
});

module.exports = router;
