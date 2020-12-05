'use strict';

import { Router, urlencoded } from 'express';
// eslint-disable-next-line new-cap
const router = Router();
import wishlists from './wishlists';
const urlencodedParser = urlencoded({ extended: true });
import OccasionsService from '../services/occasionsService';
import { ensureLoggedIn } from 'connect-ensure-login';

router.all('/new', ensureLoggedIn({ redirectTo: '/users/sign-in' }));

/* GET new occasion. */
router.get('/new', function(req, res, next) {
  res.render('templates/shell', {
    partials: { page: '../occasions/new' },
    subTitle: 'New Occasion - ',
    title: process.env.TITLE,
    breadcrumbs: req.breadcrumbs,
    user: req.user,
    csrfToken: req.csrfToken() });
});

/* POST new occasion */
router.post('/new', urlencodedParser, async function(req, res) {
  if (!req.body || !req.body.name) {
    res.status(400);
    res.render('errors/400',
        { message: 'Missing the required name of the occasion.' });
  }

  try {
    const service = new OccasionsService();
    const success = await service.create(
        req.user._id,
        req.body.name,
        req.body.occurrence);

    if (success && success.error) {
      res.status(500).send({ message: success.error });
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500);
    res.render('errors/500', { error: error });
  }
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const service = new OccasionsService();
    const success = await service.index();
    res.render('templates/shell', {
      partials: { page: '../occasions/index' },
      subTitle: 'Occasions - ',
      title: process.env.TITLE,
      breadcrumbs: req.breadcrumbs,
      user: req.user,
      occasions: success,
    });
  } catch (error) {
    res.status(500);
    res.render('errors/500', { error: error });
  }
});

/* GET occasion. */
router.get('/:occasionSlug', async function(req, res) {
  req.breadcrumbs[1].label = 'Details';

  try {
    const service = new OccasionsService();
    const occasion = await service.get(
        req.user ? req.user._id : null,
        req.params.occasionSlug);

    if (occasion) {
      res.render('templates/shell', {
        partials: { page: '../occasions/details',
          wishlists: '../wishlists/index' },
        breadcrumbs: req.breadcrumbs,
        user: req.user,
        subTitle: occasion.name + ' - ',
        title: process.env.TITLE,
        occasion: occasion,
        csrfToken: req.csrfToken(),
      });
    } else {
      res.status(404);
      res.render('errors/404');
    }
  } catch (error) {
    res.status(500);
    res.render('errors/500', { error: error });
  }
});

/* PUT updated occasion. */
router.put(
    '/:occasionSlug',
    ensureLoggedIn({ redirectTo: '/users/sign-in' }),
    urlencodedParser,
    async function(req, res) {
      if (!req.body || (!req.body.name && !req.body.occurrence)) {
        res.status(400);
        // eslint-disable-next-line max-len
        res.render('errors/400', { message: 'An updated name or occurrence date must be sent to update the occasion.' });
      }

      try {
        const service = new OccasionsService();
        const success = await service.update(
            req.user._id,
            req.params.occasionSlug,
            req.body.name,
            req.body.occurrence);
        if (success && success.error) {
          res.status(500).send({ message: success.error });
        } else {
          res.send({ message: 'Successfully updated the occasion.' });
        }
      } catch (error) {
        res.status(500);
        res.send({ message: error });
      }
    });

/* DELETE occasion.*/
router.delete(
    '/:occasionSlug',
    ensureLoggedIn({ redirectTo: '/users/sign-in' }),
    async function(req, res) {
      try {
        const service = new OccasionsService();
        await service.delete(req.user._id, req.params.occasionSlug);
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.render('errors/500', { error: error });
      }
    });

/* POST emails to send.*/
// Responsible for emailing share link to emails.
// Responsible for saving the records of occasion shares.
router.post(
    '/:occasionSlug/share',
    urlencodedParser,
    ensureLoggedIn({ redirectTo: '/users/sign-in' }),
    async function(req, res) {
      const sendService = require('../services/emails/sendService');
      const shareFactory = require('../services/emails/occasions/shareFactory');
      const UsersService = require('../services/usersService').default;

      try {
        const usersService = new UsersService();
        const user = await usersService.findById(req.user._id);

        if (user) {
          try {
            let url = req.protocol;
            url += '://';
            url += req.get('Host');
            url += '/occasions/';
            url += req.params.occasionSlug;

            await sendService.sendEmail({
              to: req.body.emails,
              subject: shareFactory.getSubjectLine(),
              html: shareFactory.getBody(user.email, url),
            });

            try {
              const OSS = require('../services/occasionSharesService').default;
              const occasionSharesService = new OSS();
              await occasionSharesService.create(
                  req.params.occasionSlug,
                  req.body.emails);

              res.status(200);
              res.send({ message: 'Successfully shared the occasion!' });
            } catch (_) {
              res.status(500);
              // eslint-disable-next-line max-len
              res.send({ message: 'An internal error occurred but, your emails were sent!' });
            }
          } catch (_) {
            res.status(500);
            // eslint-disable-next-line max-len
            res.send({ message: 'An error occurred while sharing the occasion.' });
          }
        } else {
          res.status(500);
          // eslint-disable-next-line max-len
          res.send({ message: 'Cannot find the user trying to share the occasion.' });
        }
      } catch (error) {
        res.status(500);
        // eslint-disable-next-line max-len
        res.send({ message: 'Cannot find the user trying to share the occasion.' });
      }
    });

router.use('/:occasionSlug/wishlists', function(req, _, next) {
  req.occasionSlug = req.params.occasionSlug;
  if (req.breadcrumbs) {
    req.breadcrumbs[1].label = 'Details';
    req.breadcrumbs.splice(2, 1);
  }
  next();
}, wishlists);

export default router;
