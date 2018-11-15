'use strict'

var express = require('express');
var expressSession = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(expressSession);
var path = require('path');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var logger = require('morgan');
var engines = require('consolidate');
var breadcrumbMaker = require('./utils/breadcrumbMaker');
var authConfig = require('./utils/authenticationConfig');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var occasionsRouter = require('./routes/occasions');

var app = express();

var store = new MongoDBStore({
	uri: process.env.MONGO_URL,
	collection: 'sessions',
	unset: 'destroy'
});

store.on('connected', function () {
	store.client;
})

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({cookie: true}));
app.use(breadcrumbMaker(['javascripts', 'stylesheets', 'views', 'images']));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public/views'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(require('express-session')({
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 7},
	store: store,
	resave: true,
	saveUninitialized: true
}));

app.use(authConfig.initialize());
app.use(authConfig.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/occasions', occasionsRouter);

module.exports = app;
