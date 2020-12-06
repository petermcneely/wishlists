'use strict';

import passport from 'passport';
import { Strategy } from 'passport-local';
import UsersService from '../services/usersService.js';
import { compare } from 'bcrypt';
import { default as debug } from 'debug';

const serverDebug = debug('wishlists:server');

// Configure the local strategy for use by Passport.
passport.use(new Strategy.Strategy({ usernameField: 'email' },
    async (email, password, cb) => {
      try {
        const service = new UsersService();
        const user = await service.findByEmail(email);
        serverDebug(user);
        if (!user) {
          return cb(null, false);
        }

        const now = new Date();
        if (user.passwordExpiry && user.passwordExpiry < now) {
          return cb('Your password has expired.');
        }

        if (!user.verified) {
          return cb('Your email is unverified.');
        }

        const res = compare(password, user.password);
        return cb(null, res ? user : false);
      } catch (error) {
        return cb(error);
      }
    }));


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  const service = new UsersService();
  service.findById(id).then(
      function(user) {
        cb(null, user);
      },
      function(err) {
        return cb(err);
      },
  );
});

export default passport;
