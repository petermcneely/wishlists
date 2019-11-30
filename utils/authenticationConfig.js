'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const UsersService = require('../services/usersService');
const bcrypt = require('bcrypt');

// Configure the local strategy for use by Passport.
passport.use(new Strategy({usernameField: 'email'},
    function(email, password, cb) {
      const service = new UsersService();
      service.findByEmail(email).then(
          function(user) {
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

            bcrypt.compare(password, user.password, function(err, res) {
              if (err) {
                return cb(err);
              }
              if (!res) {
                return cb(null, false);
              }
              return cb(null, user);
            });
          },
          function(err) {
            if (err) {
              return cb(err);
            }
          },
      );
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

module.exports = passport;
