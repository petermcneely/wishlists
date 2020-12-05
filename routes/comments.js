'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: true});
const CommentsService = require('../services/commentsService');

/* POST new comment */
router.post('/new', urlencodedParser, async function(req, res) {
  if (!req.body || !req.body.body) {
    res.status(400);
    res.render('errors/400',
        {message: 'Missing the required body of the comment.'});
  }

  try {
    const service = new CommentsService();
    const response = await service.create(
        req.occasionSlug,
        req.wishlistSlug,
        req.user._id,
        req.body.body,
        req.body.showOwner);

    if (response && response.error) {
      res.status(500).send({message: response.error});
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500);
    res.render('errors/500', {error: error});
  }
});


/* PUT updated wishlist item. */
router.put('/:commentOid', urlencodedParser, async function(req, res) {
  if (!req.body || (!req.body.body && !req.body.showOwner)) {
    res.status(400);
    // eslint-disable-next-line max-len
    const msg = 'An updated body or show owner selection must be sent to update the comment.';
    res.render('errors/400', {message: msg});
  }

  try {
    const service = new CommentsService();
    const success = await service.update(
        req.occasionSlug,
        req.wishlistSlug,
        req.params.commentOid,
        req.body.body,
        req.body.showOwner);

    if (success && success.error) {
      res.status(500).send({message: success.error});
    } else {
      res.send({message: 'Successfully updated the comment.'});
    }
  } catch (error) {
    res.status(500);
    res.send({message: error});
  }
});

/* DELETE comment.*/
router.delete('/:commentOid', async function(req, res) {
  try {
    const service = new CommentsService();
    await service.delete(
        req.occasionSlug,
        req.wishlistSlug,
        req.params.commentOid);
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
    res.render('errors/500', {error: error});
  }
});

module.exports = router;
