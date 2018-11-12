'use strict'

const dal = require('../DAL/occasions');

module.exports = class OccasionsService {

	/*
	userId: the id of the creating user
	name: name of the occasion
	occurrence: date of the occasion
	*/
	create(userId, name, occurrence) {
		return dal.createOccasion(userId, name, occurrence);
	}

	index() {
		return dal.getOccasions();
	}

	/*
	userId: unique identifier of the requesting user
	slug: unique slug of the occasion document
	*/
	get(userId, slug) {
		let promises = [];
		promises.push(dal.getOccasion(slug));
		if (userId) {

			let UsersService = require('../services/usersService');
			let usersService = new UsersService();
			promises.push(usersService.findById(userId));
		}
		return Promise.all(promises).then(results => {
			var occasion = results[0];
			var user = userId ? results[1] : null;

			if (occasion) {
				occasion.owns = occasion.userId.equals(userId);
				occasion.sharedWithUser = false;
				if (user) {
					if (occasion.shares) {
						occasion.shares.forEach(element => {
							occasion.sharedWithUser = occasion.sharedWithUser || element === user.email;
						});
					}
				}

				occasion.sharedWithUser = occasion.sharedWithUser || occasion.owns;
			}
			return occasion;
		});
	}

	/*
	slug: unique slug of the occasion document
	name: new name to update the occasion to (optional)
	occurrence: new name to update the occasion to (optional)
	*/
	update(userId, slug, name, occurrence) {
		var updateObject = {};
		if (name) { updateObject.name = name; }
		if (occurrence) { updateObject.occurrence = new Date(occurrence); }
		return dal.updateOccasion({slug: slug, userId: userId}, updateObject);
	}

	/*
	slug: the unique identifier of the occasion document
	*/
	delete(userId, slug) {
		return dal.deleteOccasion({slug: slug, userId: userId});
	}
}