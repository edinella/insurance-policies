const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const login = require('./routes/login');
const clients = require('./routes/clients');
const policies = require('./routes/policies');

const notFound = require('./middlewares/notFound');
const errors = require('./middlewares/errors');

const app = express();

app.set('env', process.env.NODE_ENV);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/public')));

app.use('/', index);
app.use('/login', login);
app.use('/clients', clients);
app.use('/policies', policies);

app.use(notFound);
app.use(errors);

module.exports = app;
