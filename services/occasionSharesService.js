'use strict';

const dal = require('../DAL/occasions');

module.exports = class OccasionSharesService {

  /**
   * Creates the occasion shares
   * @param {string} occasionSlug The slug of the occasion
   * @param {Array} emails The array of emails to share the occasion with
   * @return {Promise}
   */
  create(occasionSlug, emails) {
    return dal.createOccasionShares(occasionSlug, emails);
  }

  /**
   * Gets the occasion share
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} email The email associated with the share
   * @return {Promise}
   */
  get(occasionSlug, email) {
    return dal.getOccasionShare(occasionSlug, email);
  }

  /**
   * Deletes the occasion share
   * @param {string} occasionSlug The slug of the occasion
   * @param {string} email The email associated with the share
   * @return {Promise}
   */
  delete(occasionSlug, email) {
    return deleteOccasionShare(occasionSlug, email);
  }
}
;
