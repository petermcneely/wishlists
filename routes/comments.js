'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: true});
const CommentsService = require('../services/commentsService');


/* POST new comment */
router.post('/new', urlencodedParser, function(req, res) {
  if (!req.body || !req.body.body) {
    res.status(400);
    res.render('errors/400',
        {message: 'Missing the required body of the comment.'});
  }

  const service = new CommentsService();
  service.create(req.occasionSlug, req.wishlistSlug, req.user._id,
      req.body.body, req.body.showOwner).then((success) => {
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


/* PUT updated wishlist item. */
router.put('/:commentOid', urlencodedParser, function(req, res) {
  if (!req.body || (!req.body.body && !req.body.showOwner)) {
    res.status(400);
    // eslint-disable-next-line max-len
    const msg = 'An updated body or show owner selection must be sent to update the comment.';
    res.render('errors/400', {message: msg});
  }

  const service = new CommentsService();
  service.update(
    req.occasionSlug,
    req.wishlistSlug,
    req.params.commentOid,
    req.body.body,
    req.body.showOwner).then((success) => {
    if (success && success.error) {
      res.status(500).send({message: success.error});
    } else {
      res.send({message: 'Successfully updated the comment.'});
    }
  }).catch((error) => {
    res.status(500);
    res.send({message: error});
  });
});

/* DELETE comment.*/
router.delete('/:commentOid', function(req, res) {
  const service = new CommentsService();
  service.delete(
      req.occasionSlug, req.wishlistSlug, req.params.commentOid).then(
      () => {
        res.sendStatus(200);
      },
  ).catch(
      function(error) {
        res.status(500);
        res.render('errors/500', {error: error});
      },
  );
});

module.exports = router;
