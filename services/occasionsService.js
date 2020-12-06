'use strict';

import { createOccasion, getOccasions, getOccasion, updateOccasion, deleteOccasion } from '../DAL/occasions.js';
import UsersService from '../services/usersService.js';

export default class OccasionsService {
  /**
   * Creates the occasion
   * @param {int} userId: the id of the creating user
   * @param {string} name: name of the occasion
   * @param {string} occurrence: date of the occasion
   * @return {Promise}
   */
  create(userId, name, occurrence) {
    return createOccasion(userId, name, occurrence);
  }

  /**
   * Lists the occasions
   * @return {Promise}
   */
  index() {
    return getOccasions();
  }

  /**
  * Gets the occasion
  * @param {int} userId: unique identifier of the requesting user
  * @param {string} slug: unique slug of the occasion document
  * @return {Promise}
  */
  get(userId, slug) {
    const promises = [];
    promises.push(getOccasion(slug));
    if (userId) {
      const usersService = new UsersService();
      promises.push(usersService.findById(userId));
    }
    return Promise.all(promises).then((results) => {
      const occasion = results[0];
      const user = userId ? results[1] : null;

      if (occasion) {
        occasion.owns = occasion.userId.equals(userId);
        occasion.sharedWithUser = false;
        if (user) {
          if (occasion.shares) {
            occasion.shares.forEach((element) => {
              occasion.sharedWithUser =
              occasion.sharedWithUser || element === user.email;
            });
          }
        }

        occasion.sharedWithUser = occasion.sharedWithUser || occasion.owns;
      }
      return occasion;
    });
  }

  /**
  * Updates the occasion
  * @param {int} userId: the id of the user
  * @param {string} slug: unique slug of the occasion document
  * @param {string} name: new name to update the occasion to (optional)
  * @param {string} occurrence: new name to update the occasion to (optional)
  * @return {Promise}
  */
  update(userId, slug, name, occurrence) {
    const updateObject = {};
    if (name) {
      updateObject.name = name;
    }
    if (occurrence) {
      updateObject.occurrence = new Date(occurrence);
    }
    return updateOccasion({ slug: slug, userId: userId }, updateObject);
  }

  /**
  * Deletes the occasion
  * @param {int} userId: the id of the user
  * @param {string} slug: the unique identifier of the occasion document
  * @return {Promise}
  */
  delete(userId, slug) {
    return deleteOccasion({ slug: slug, userId: userId });
  }
}
;
