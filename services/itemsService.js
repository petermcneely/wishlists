'use strict';

const dal = require('../DAL/occasions');

module.exports = class ItemsService {
  /**
  * Creates an item
  * @param {string} occasionSlug The slug of the occasion
  * @param {string} wishlistSlug The slug of the wishlist
  * @param {string} name The name of the item
  * @param {string} comments Any comments for the item
  * @param {string} link The link associated with the item
  * @return {Promise}
  */
  create(occasionSlug, wishlistSlug, name, comments, link) {
    return dal.createItem(occasionSlug, wishlistSlug, name, comments, link);
  }

  /**
   * Gets the item
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} itemSlug The slug of the item
   * @param {string} userId The id of the requesting user
   * @return {Promise}
   */
  get(occasionSlug, wishlistSlug, itemSlug, userId) {
    return dal.getItem(occasionSlug, wishlistSlug, itemSlug)
        .then((response) => {
          if (response) {
            response.item.owns = response.userId.equals(userId);
            response.item.occasion = response.occasion;
            return response.item;
          }
        });
  }

  /**
   * Updates the item
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} itemSlug The slug of the item
   * @param {string} newName The new name of the item
   * @param {string} comments The new comments
   * @param {string} link The new link
   * @return {Promise}
   */
  update(occasionSlug, wishlistSlug, itemSlug, newName, comments, link) {
    const updateObject = {};
    if (newName) {
      updateObject.name = newName;
    }
    if (comments) {
      updateObject.comments = comments;
    }
    if (link) {
      updateObject.link = link;
    }

    return dal.updateItem(occasionSlug, wishlistSlug, itemSlug, updateObject);
  }

  /**
   * Deletes the item
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} itemSlug The slug of the item
   * @return {Promise}
   */
  delete(occasionSlug, wishlistSlug, itemSlug) {
    return dal.deleteItem(occasionSlug, wishlistSlug, itemSlug);
  }

  /**
   * Claims the item
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} itemSlug The slug of the item
   * @param {int} userId The id of the user
   * @return {Promise}
   */
  claim(occasionSlug, wishlistSlug, itemSlug, userId) {
    return dal.claimItem(occasionSlug, wishlistSlug, itemSlug, userId);
  }

  /**
   * Unclaims the item
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} itemSlug The slug of the item
   * @param {int} userId The id of the user
   * @return {Promise}
   */
  unclaim(occasionSlug, wishlistSlug, itemSlug, userId) {
    return dal.unclaimItem(occasionSlug, wishlistSlug, itemSlug, userId);
  }
}
;
