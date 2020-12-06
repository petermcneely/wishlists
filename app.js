'use strict';

import express from 'express';
import expressSession from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import logger from 'morgan';
import { mustache } from 'consolidate';
import breadcrumbMaker from './utils/breadcrumbMaker.js';
import passport from './utils/authenticationConfig.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import occasionsRouter from './routes/occasions.js';
import path from 'path';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

const MongoDBStore = connectMongoDBSession(expressSession);
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
  console.error(error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(breadcrumbMaker(['javascripts', 'stylesheets', 'views', 'images']));
app.use(express.static(join(dirname, 'public')));
app.set('views', join(dirname, 'public/views'));
app.engine('html', mustache);
app.set('view engine', 'html');
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: store,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/occasions', occasionsRouter);

export default app;
