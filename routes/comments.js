'use strict';

import { Router, urlencoded } from 'express';
// eslint-disable-next-line new-cap
const router = Router();
const urlencodedParser = urlencoded({ extended: true });
import CommentsService from '../services/commentsService.js';
import WishlistsService from '../services/wishlistsService.js';
import UsersService from '../services/usersService.js';
import { sendEmail } from '../services/emails/sendService.js';

const notifyOwner = async (showOwner, commentingUserId, occasionSlug, wishlistSlug, comment, isUpdate = false) => {
  if (showOwner) {
    const wishlistsService = new WishlistsService();
    const wishlist = await wishlistsService.get(
        commentingUserId,
        occasionSlug,
        wishlistSlug);

    if (JSON.stringify(wishlist.userId) !== JSON.stringify(commentingUserId)) {
      const usersService = new UsersService();
      const owner = await usersService.findById(wishlist.userId);

      await sendEmail({
        to: owner.email,
        subject: isUpdate ? "Someone updated their comment on your wishlist" : "A new comment was posted on your wishlist",
        html: `<p>Someone wrote: ${comment}</p><p>View your wishlist to reply</p>`,
      });
    }
  }
};

/* POST new comment */
router.post('/new', urlencodedParser, async function(req, res) {
  if (!req.body || !req.body.body) {
    res.status(400);
    res.render('errors/400',
        { message: 'Missing the required body of the comment.' });
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
      res.status(500).send({ message: response.error });
    } else {
      res.sendStatus(200);
    }

    await notifyOwner(
      req.body.showOwner,
      req.user._id,
      req.occasionSlug,
      req.wishlistSlug,
      req.body.body);

  } catch (error) {
    res.status(500);
    res.render('errors/500', { error: error });
  }
});


/* PUT updated wishlist item. */
router.put('/:commentOid', urlencodedParser, async function(req, res) {
  if (!req.body || (!req.body.body && !req.body.showOwner)) {
    res.status(400);
    // eslint-disable-next-line max-len
    const msg = 'An updated body or show owner selection must be sent to update the comment.';
    res.render('errors/400', { message: msg });
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
      res.status(500).send({ message: success.error });
    } else {
      res.send({ message: 'Successfully updated the comment.' });
    }

    await notifyOwner(
      req.body.showOwner,
      req.user._id,
      req.occasionSlug,
      req.wishlistSlug,
      req.body.body,
      true);
      
  } catch (error) {
    res.status(500);
    res.send({ message: error });
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
    res.render('errors/500', { error: error });
  }
});

export default router;
