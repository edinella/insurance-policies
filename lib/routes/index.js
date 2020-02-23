const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome!' });
  // if (req.user) {
  //   res.render('index', { title: 'Welcome!' });
  // } else {
  //   res.redirect('/login');
  // }
});

module.exports = router;
