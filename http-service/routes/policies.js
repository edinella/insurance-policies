const express = require('express');
const router = express.Router();

router.get('/policies', (req, res, next) => {
  res.send('respond with policies');
});

module.exports = router;
