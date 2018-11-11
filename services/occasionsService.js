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
	id: unique identifier of the occasion document
	*/
	get(userId, id) {
		let promises = [];
		promises.push(dal.getOccasion(id));
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
	id: unique identifier of the occasion document
	name: new name to update the occasion to (optional)
	occurrence: new name to update the occasion to (optional)
	*/
	update(userId, id, name, occurrence) {
		var updateObject = {};
		if (name) { updateObject.name = name; }
		if (occurrence) { updateObject.occurrence = new Date(occurrence); }
		return dal.updateOccasion({id: id, userId: userId}, updateObject);
	}

	/*
	id: the unique identifier of the occasion document
	*/
	delete(userId, id) {
		return dal.deleteOccasion({id: id, userId: userId});
	}
}