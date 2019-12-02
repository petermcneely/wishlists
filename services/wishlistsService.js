'use strict';

const occasionDal = require('../DAL/occasions');
const userDal = require('../DAL/users');

module.exports = class WishlistsService {
  /**
  * @param {int} userId the id of the creating user.
  * @param {string} occasionSlug the unique identifier of
  * the associated occasion.
  * @param {string} name name of the wishlist
  * @return {Promise} Promise on creating a wishlist
  */
  create(userId, occasionSlug, name) {
    return occasionDal.createWishlist(userId, name, occasionSlug);
  }

  /**
  * Gets the wishlist
  * @param {int} userId unique identifier of the requesting user
  * @param {string} occasionSlug unique identifier of the owning occasion
  * @param {string} slug unique slug of the wishlist in this occasion
  * @return {Promise}
  */
  get(userId, occasionSlug, slug) {
    const promises = [
      userDal.findById(userId),
      occasionDal.getWishlist(occasionSlug, slug),
    ];

    return Promise.all(promises).then((results) => {
      const user = results[0];
      const occasion = results[1];
      if (occasion && occasion.wishlists && occasion.wishlists.length) {
        const wishlist = occasion.wishlists[0];

        // Handle owns
        wishlist.owns = wishlist.userId.equals(userId);

        // Handle shared with user.
        wishlist.sharedWithUser = false;
        if (occasion.shares && user) {
          occasion.shares.forEach((element) => {
            wishlist.sharedWithUser =
            wishlist.sharedWithUser || element === user.email;
          });
        }
        wishlist.sharedWithUser =
        wishlist.sharedWithUser || occasion.userId.equals(userId);
        wishlist.occasion = {
          slug: occasion.slug,
        };

        // Handle items.
        if (wishlist.items && wishlist.items.length) {
          for (let i = 0; i < wishlist.items.length; ++i) {
            if (wishlist.items[i].claimed) {
              wishlist.items[i].claimedByUser =
              wishlist.items[i].claimed.by.equals(userId);
            }
          }
        }

        // Handle comments.
        if (wishlist.comments && wishlist.comments.length) {
          if (wishlist.owns) {
            const comments = [];
            for (let i = 0; i < wishlist.comments.length; ++i) {
              if (wishlist.comments[i].showOwner) {
                comments.push(wishlist.comments[i]);
              }
            }
            wishlist.comments = comments;
          }
          for (let i = 0; i < wishlist.comments.length; ++i) {
            const currentComment = wishlist.comments[i];
            currentComment.owns = currentComment.userId.equals(userId);
          }
        }
        return wishlist;
      } else {
        return null;
      }
    });
  }

  /**
  * @param {int} userId: the id of the requesting user; should own the wishlist
  * @param {string} occasionSlug: unique identifier of the owning occasion
  * @param {string} slug: the wishlist's current, unique slug
  * @param {string} newName: the wishlist's new name
  * @return {Promise}
  */
  update(userId, occasionSlug, slug, newName) {
    return occasionDal.updateWishlist(occasionSlug, userId, slug, newName);
  }

  /**
  * @param {int} userId: the id of the requesting user; should own the wishlist
  * @param {string} occasionSlug: unique identifier of the owning occasion
  * @param {string} slug: the unique slug of the wishlist to delete
  * @return {Promise}
  * */
  delete(userId, occasionSlug, slug) {
    return occasionDal.deleteWishlist(occasionSlug, userId, slug);
  }
}
;
