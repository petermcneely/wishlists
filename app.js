'use strict';

const express = require('express');
const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');
const engines = require('consolidate');
const breadcrumbMaker = require('./utils/breadcrumbMaker');
const authConfig = require('./utils/authenticationConfig');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const occasionsRouter = require('./routes/occasions');
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  databaseName: 'wishlists',
  collection: 'sessions',
});

store.on('connected', function() {
  store.client;
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(csrf({cookie: true}));
app.use(breadcrumbMaker(['javascripts', 'stylesheets', 'views', 'images']));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public/views'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},
  store: store,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
}));

app.use(authConfig.initialize());
app.use(authConfig.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/occasions', occasionsRouter);

module.exports = app;
