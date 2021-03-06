'use strict';

import { Router, urlencoded } from 'express';
// eslint-disable-next-line new-cap
const router = Router();
import items from './items.js';
import comments from './comments.js';
const urlencodedParser = urlencoded({ extended: true });
import { ensureLoggedIn } from 'connect-ensure-login';
import WishlistsService from '../services/wishlistsService.js';

router.all('/new', ensureLoggedIn({ redirectTo: '/users/sign-in' }));

/* GET new wishlist. */
router.get('/new', function(req, res, next) {
  res.render('templates/shell', {
    partials: { page: '../wishlists/new' },
    breadcrumbs: req.breadcrumbs,
    user: req.user,
    subTitle: 'New Wishlist - ',
    title: process.env.TITLE,
    occasionSlug: req.occasionSlug,
    csrfToken: req.csrfToken(),
  });
});

/* POST new wishlist */
router.post(
    '/new',
    urlencodedParser,
    async function(req, res) {
      if (!req.body || !req.body.name) {
        res.status(400);
        res.render('errors/400',
            { message: 'Missing the required name of the wishlist.' });
      }

      try {
        const service = new WishlistsService();
        const success = await service.create(
            req.user._id,
            req.occasionSlug,
            req.body.name);
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

/* GET wishlist. */
router.get(
    '/:wishlistSlug',
    async function(req, res) {
      req.breadcrumbs[2].label = 'Wishlist';

      try {
        const service = new WishlistsService();
        const wishlist = await service.get(
            req.user ? req.user._id : null,
            req.occasionSlug, req.params.wishlistSlug);
        if (wishlist) {
          res.render('templates/shell', {
            partials: {
              page: '../wishlists/details',
              items: '../items/index',
              comments: '../comments/index' },
            breadcrumbs: req.breadcrumbs,
            user: req.user,
            subTitle: wishlist.name + ' - ',
            title: process.env.TITLE,
            wishlist: wishlist,
            csrfToken: req.csrfToken() });
        } else {
          res.status(404);
          res.render('errors/404');
        }
      } catch (error) {
        res.status(500);
        res.render('errors/500', { error: error });
      }
    });

/* PUT updated wishlist. */
router.put(
    '/:wishlistSlug',
    ensureLoggedIn({ redirectTo: '/users/sign-in' }),
    urlencodedParser,
    async function(req, res) {
      if (!req.body || !req.body.name) {
        res.status(400);
        res.render('errors/400',
            // eslint-disable-next-line max-len
            { message: 'An updated name or occurrence date must be sent to update the wishlist.' });
      }

      try {
        const service = new WishlistsService();
        const success = await service.update(
            req.user._id,
            req.occasionSlug,
            req.params.wishlistSlug,
            req.body.name);
        if (success && success.error) {
          res.status(500).send({ message: success.error });
        } else {
          res.send({ message: 'Successfully updated the wishlist.' });
        }
      } catch (error) {
        res.status(500);
        res.send({ message: error });
      }
    });

/* DELETE wishlist.*/
router.delete(
    '/:wishlistSlug',
    ensureLoggedIn({ redirectTo: '/users/sign-in' }),
    async function(req, res) {
      try {
        const service = new WishlistsService();
        await service.delete(
            req.user._id,
            req.occasionSlug,
            req.params.wishlistSlug);
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.render('errors/500', { error: error });
      }
    });

router.use('/:wishlistSlug/items', function(req, res, next) {
  req.wishlistSlug = req.params.wishlistSlug;
  if (req.breadcrumbs) {
    req.breadcrumbs[2].label = 'Wishlist';
    req.breadcrumbs.splice(3, 1);
  }
  next();
}, items);

router.use('/:wishlistSlug/comments', (req, res, next) => {
  req.wishlistSlug = req.params.wishlistSlug;
  if (req.breadcrumbs) {
    req.breadcrumbs[2].label = 'Wishlist';
    req.breadcrumbs.splice(3, 1);
  }
  next();
}, comments);

export default router;
