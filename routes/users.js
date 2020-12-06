'use strict';

import { Router } from 'express';
// eslint-disable-next-line new-cap
const router = Router();
import passport from 'passport';
import UserService from '../services/usersService.js';
import { ensureLoggedIn } from 'connect-ensure-login';
import { sendEmail } from '../services/emails/sendService.js';
import { getSubjectLine, getBody } from '../services/emails/users/signUpFactory.js';
import { getURL } from '../utils/urlFactory.js';

router.get('/sign-up',
    function(req, res) {
      if (req.isAuthenticated && req.isAuthenticated()) {
        res.redirect('profile');
      } else {
        res.render('templates/shell', {
          partials: { page: '../users/signUp' },
          subTitle: 'Sign Up - ',
          title: process.env.TITLE,
          user: req.user,
          csrfToken: req.csrfToken(),
        });
      }
    });

router.post(
    '/sign-up',
    async function(req, res) {
      try {
        const service = new UserService();
        const response = await service.createUser(
            req.body.email,
            req.body.password,
            req.body.retypePassword);

        if (response.message) {
          res.status(500).json({ message: response.message });
        } else {
          const params = await service.encryptVerificationParameters(
              req.body.email);
          const subjectLine = getSubjectLine();
          const html = getBody(
              req.body.email,
              getURL(req, `/users/verify/${params.toString('hex')}`));

          await sendEmail({
            to: req.body.email,
            subject: subjectLine,
            html: html,
          });

          // eslint-disable-next-line max-len
          res.status(200).send({ message: 'Please verify your email address before logging in.' });
        }
      } catch (_) {
        res.status(500).send({ message: 'An internal error has occurred.' });
      }
    });

router.get('/sign-in',
    function(req, res) {
      res.render('templates/shell', {
        partials: { page: '../users/signIn' },
        subTitle: 'Sign In - ',
        title: process.env.TITLE,
        user: req.user,
        csrfToken: req.csrfToken(),
      });
    });

router.post('/sign-in', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(401).send('Invalid/unverified email or invalid password.');
    } else {
      req.logIn(user, function(err) {
        if (err) {
          next(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  })(req, res, next);
});

router.get('/sign-out',
    ensureLoggedIn({ redirectTo: 'sign-in' }),
    function(req, res) {
      req.logout();
      req.session = null;
      res.redirect('/');
    });

router.get('/profile',
    ensureLoggedIn({ redirectTo: 'sign-in' }),
    function(req, res) {
      res.render('templates/shell', {
        partials: { page: '../users/profile' },
        subTitle: 'Profile - ',
        title: process.env.TITLE,
        user: req.user,
        csrfToken: req.csrfToken(),
      });
    });

router.get('/forgot-password', (req, res) => {
  res.render('templates/shell', {
    partials: { page: '../users/forgotPassword' },
    subTitle: 'Forgot Password - ',
    title: process.env.TITLE,
    csrfToken: req.csrfToken(),
  });
});

router.post('/forgot-password', async function(req, res) {
  try {
    const service = new UserService();
    const password = await service.overwritePassword(req.body.email);
    await sendEmail({
      to: req.body.email,
      subject: getSubjectLine(),
      html: getBody(password, getURL(req, '/users/sign-in')),
    });
    res.status(200).send({ message: 'Successfully sent you and email!' });
  } catch (_) {
    res.render('errors/500');
  }
});

router.post(
    '/change-password',
    ensureLoggedIn({ redirectTo: 'sign-in' }),
    async function(req, res) {
      try {
        const service = new UserService();
        await service.changePassword(
            req.body.newPassword,
            req.body.retypePassword,
            req.user ? req.user._id : null);
        res.status(200).send(
            { message: 'Successfully changed your password!' });
      } catch (_) {
        res.status(500).send({ message: 'An internal error has occurred.' });
      }
    });

// Assumes that a change in email with a verified user is a verified change.
router.put(
    '/change-email',
    ensureLoggedIn({ redirectTo: 'sign-in' }),
    async function(req, res) {
      try {
        const service = new UserService();
        await service.changeEmail(req.body.newEmail, req.user._id);
        res.status(200).send({ message: 'Successfully changed your email!' });
      } catch (_) {
        res.status(500).send({ message: 'An internal error has occurred.' });
      }
    });

router.get(
    '/verify/:token',
    async function(req, res) {
      try {
        const service = new UserService();
        await service.verify(req.params.token);
        res.render('templates/shell', {
          partials: { page: '../users/verify' },
          subTitle: 'Verified - ',
          title: process.env.TITLE,
        });
      } catch (_) {
        res.status(500).render('errors/500');
      }
    });

export default router;
