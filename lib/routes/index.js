const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Welcome!' });
  } else {
    res.redirect('/login');
  }
});
router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
