'use strict';

const dal = require('../DAL/occasions');

module.exports = class CommentsService {
  /**
   * Creates the comment
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {int} userId The id of the requesting user
   * @param {string} body The body of the comment
   * @param {boolean} showOwner Flag stating whether to show
   * the owner the comment
   * @return {Promise}
   */
  create(occasionSlug, wishlistSlug, userId, body, showOwner) {
    return dal.createComment(
        occasionSlug, wishlistSlug, userId, body, showOwner);
  }

  /**
   * Updates the comment
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} commentOid The oid of the comment
   * @param {string} body The body of the comment
   * @param {boolean} showOwner Flag stating whether to show
   * the owner the comment
   * @return {Promise}
   */
  update(occasionSlug, wishlistSlug, commentOid, body, showOwner) {
    const updateObject = {
      modifiedAt: new Date(),
      showOwner: showOwner,
    };

    if (body) {
      updateObject.body = body;
    }

    return dal.updateComment(
        occasionSlug, wishlistSlug, commentOid, updateObject);
  }

  /**
   * Deletes the comment
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} wishlistSlug The slug of the wishlist
   * @param {string} commentOid The oid of the comment
   * @return {Promise}
   */
  delete(occasionSlug, wishlistSlug, commentOid) {
    return dal.deleteComment(occasionSlug, wishlistSlug, commentOid);
  }
};
