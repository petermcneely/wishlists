'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const wishlists = require('./wishlists');
const urlencodedParser = express.urlencoded({extended: true});
const OccasionsService = require('../services/occasionsService');
const ensure = require('connect-ensure-login');

router.all('/new', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}));

/* GET new occasion. */
router.get('/new', function(req, res, next) {
  res.render('templates/shell', {
    partials: {page: '../occasions/new'},
    subTitle: 'New Occasion - ',
    title: process.env.TITLE,
    breadcrumbs: req.breadcrumbs,
    user: req.user,
    csrfToken: req.csrfToken()});
});

/* POST new occasion */
router.post('/new', urlencodedParser, function(req, res) {
  if (!req.body || !req.body.name) {
    res.status(400);
    res.render('errors/400',
        {message: 'Missing the required name of the occasion.'});
  }

  const service = new OccasionsService();
  service.create(req.user._id, req.body.name,
      req.body.occurrence).then((success) => {
    if (success && success.error) {
      res.status(500).send({message: success.error});
    } else {
      res.sendStatus(200);
    }
  }).catch((error) => {
    res.status(500);
    res.render('errors/500', {error: error});
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  const service = new OccasionsService();
  service.index().then(
      function(success) {
        res.render('templates/shell', {
          partials: {page: '../occasions/index'},
          subTitle: 'Occasions - ',
          title: process.env.TITLE,
          breadcrumbs: req.breadcrumbs,
          user: req.user,
          occasions: success,
        });
      },
  ).catch(
      function(error) {
        res.status(500);
        res.render('errors/500', {error: error});
      },
  );
});

/* GET occasion. */
router.get('/:occasionSlug', function(req, res) {
  req.breadcrumbs[1].label = 'Details';
  const service = new OccasionsService();
  service.get(req.user ? req.user._id : null, req.params.occasionSlug).then(
      function(occasion) {
        if (occasion) {
          res.render('templates/shell', {
            partials: {page: '../occasions/details',
              wishlists: '../wishlists/index'},
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
      },
  ).catch(
      function(error) {
        res.status(500);
        res.render('errors/500', {error: error});
      },
  );
});

/* PUT updated occasion. */
router.put('/:occasionSlug',
    ensure.ensureLoggedIn(
        {redirectTo: '/users/sign-in'}), urlencodedParser, function(req, res) {
      if (!req.body || (!req.body.name && !req.body.occurrence)) {
        res.status(400);
        // eslint-disable-next-line max-len
        res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the occasion.'});
      }

      const service = new OccasionsService();
      service.update(req.user._id, req.params.occasionSlug,
          req.body.name, req.body.occurrence).then((success) => {
        if (success && success.error) {
          res.status(500).send({message: success.error});
        } else {
          res.send({message: 'Successfully updated the occasion.'});
        }
      }).catch((error) => {
        res.status(500);
        res.send({message: error});
      });
    });


/* DELETE occasion.*/
router.delete('/:occasionSlug',
    ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), function(req, res) {
      const service = new OccasionsService();
      service.delete(req.user._id, req.params.occasionSlug).then(
          function(success) {
            res.sendStatus(200);
          },
      ).catch(
          function(error) {
            res.status(500);
            res.render('errors/500', {error: error});
          },
      );
    });

/* POST emails to send.*/
// Responsible for emailing share link to emails.
// Responsible for saving the records of occasion shares.
router.post('/:occasionSlug/share',
    urlencodedParser, ensure.ensureLoggedIn(
        {redirectTo: '/users/sign-in'}), function(req, res) {
      const sendService = require('../services/emails/sendService');
      const shareFactory = require('../services/emails/occasions/shareFactory');
      const UsersService = require('../services/usersService');

      const usersService = new UsersService();

      usersService.findById(req.user._id).then(function(user) {
        if (user) {
          sendService.sendEmail({
            to: req.body.emails,
            subject: shareFactory.getSubjectLine(),
            html: shareFactory.getBody(user.email, req.protocol + '://' + req.get('Host') + '/occasions/' + req.params.occasionSlug),
          }).then(function() {
            const OccasionSharesService =
                require('../services/occasionSharesService');
            const occasionSharesService = new OccasionSharesService();
            occasionSharesService.create(req.params.occasionSlug,
                req.body.emails).then(function() {
              res.status(200);
              res.send({message: 'Successfully shared the occasion!'});
            }).catch(function(e) {
              res.status(500);
              // eslint-disable-next-line max-len
              res.send({message: 'An internal error occurred but, your emails were sent!'});
            });
          }).catch(function(e) {
            res.status(500);
            // eslint-disable-next-line max-len
            res.send({message: 'An error occurred while sharing the occasion.'});
          });
        } else {
          res.status(500);
          // eslint-disable-next-line max-len
          res.send({message: 'Cannot find the user trying to share the occasion.'});
        }
      });
    });

router.use('/:occasionSlug/wishlists', function(req, res, next) {
  req.occasionSlug = req.params.occasionSlug;
  if (req.breadcrumbs) {
    req.breadcrumbs[1].label = 'Details';
    req.breadcrumbs.splice(2, 1);
  }
  next();
}, wishlists);

module.exports = router;
