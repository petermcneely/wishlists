'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: true});
const ItemsService = require('../services/itemsService');

/* GET new wishlist item. */
router.get('/new', function(req, res, next) {
  res.render('templates/shell', {
    partials: {page: '../items/new'},
    breadcrumbs: req.breadcrumbs,
    user: req.user,
    subTitle: 'New Wishlist Item - ',
    title: process.env.TITLE,
    occasionSlug: req.occasionSlug,
    wishlistSlug: req.wishlistSlug,
    csrfToken: req.csrfToken(),
  });
});

/* POST new wishlist item */
router.post('/new', urlencodedParser, function(req, res) {
  if (!req.body || !req.body.name) {
    res.status(400);
    res.render('errors/400',
        {message: 'Missing the required name of the wishlist item.'});
  }

  const service = new ItemsService();
  service.create(req.occasionSlug, req.wishlistSlug, req.body.name,
      req.body.comments, req.body.link).then((success) => {
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

/* GET wishlist item. */
router.get('/:itemSlug', function(req, res) {
  req.breadcrumbs[3].label = 'Item';
  const service = new ItemsService();
  service.get(req.occasionSlug, req.wishlistSlug, req.params.itemSlug,
    req.user ? req.user._id : null).then(
      function(item) {
        if (item) {
          res.render('templates/shell', {
            partials: {page: '../items/details'},
            breadcrumbs: req.breadcrumbs,
            user: req.user,
            subTitle: item.name + ' - ',
            title: process.env.TITLE,
            occasionSlug: req.occasionSlug,
            wishlistSlug: req.wishlistSlug,
            item: item,
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

/* PUT updated wishlist item. */
router.put('/:itemSlug', urlencodedParser, function(req, res) {
  if (!req.body || (!req.body.name && !req.body.comments && !req.body.link)) {
    res.status(400);
    // eslint-disable-next-line max-len
    const msg = 'An updated name, comments, or link must be sent to update the wishlist item.';
    res.render('errors/400', {message: msg});
  }

  const service = new ItemsService();
  service.update(req.occasionSlug, req.wishlistSlug, req.params.itemSlug,
      req.body.name, req.body.comments, req.body.link).then((success) => {
    if (success && success.error) {
      res.status(500).send({message: success.error});
    } else {
      res.send({message: 'Successfully updated the wishlist item.'});
    }
  }).catch((error) => {
    res.status(500);
    res.send({message: error});
  });
});

/* DELETE wishlist item.*/
router.delete('/:itemSlug', function(req, res) {
  const service = new ItemsService();
  service.delete(req.occasionSlug, req.wishlistSlug, req.params.itemSlug).then(
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

router.put('/:itemSlug/claim', function(req, res) {
  const service = new ItemsService();
  service.claim(req.occasionSlug, req.wishlistSlug, req.params.itemSlug,
      req.user ? req.user._id : null).then(() => {
    res.status(200);
    res.send({message: 'You successfully claimed the wishlist item!'});
  }).catch((e) => {
    res.status(500);
    res.send({message: 'An error occurred while claiming the wishlist item.'});
    console.log(e);
  });
});

router.put('/:itemSlug/unclaim', function(req, res) {
  const service = new ItemsService();
  service.unclaim(req.occasionSlug, req.wishlistSlug, req.params.itemSlug,
      req.user ? req.user._id : null).then(() => {
    res.status(200);
    res.send({message: 'You successfully unclaimed the wishlist item!'});
  }).catch((e) => {
    res.status(500);
    res.send(
        {message: 'An error occurred while unclaiming the wishlist item.'});
    console.log(e);
  });
});

module.exports = router;
