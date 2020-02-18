const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // if (!req.user) {
  //   res.status(401);
  // }
  res.json([]);
});

module.exports = router;
