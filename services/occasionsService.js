'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');
var WishlistsService = require('./wishlistsService');

module.exports = class OccasionsService {
	constructor() {
		this.tableName = 'occasions';
	}

	/*
	userId: the id of the creating user
	name: name of the occasion
	occurrence: date of the occasion
	*/
	create(userId, name, occurrence) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).insertOne({
					userId: new mongodb.ObjectID(userId),
					name: name,
					occurrence: new Date(occurrence)
				}).then(
					function (result) {
						client.close();
						return result.insertedId;
					}
				)
				.catch(
					function (error) {
						console.log("Can't connect to the occasions collection.");
						console.log(error);
						client.close();
					}
				);
			}.bind(this)
		);
	}

	index() {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).find().toArray().then(
					function (success) {
						client.close();
						return success;
					}
				).catch(
					function (error) {
						console.log(error);
						client.close();
					}
				)
			}.bind(this)
		);
	}

	/*
	userId: unique identifier of the requesting user
	id: unique identifier of the occasion document
	*/
	get(userId, id) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			var objectId = new mongodb.ObjectID(id);
			let promises = [];
			promises.push(db.collection(this.tableName).findOne(objectId));
			if (userId) {

				let UsersService = require('../services/usersService');
				let usersService = new UsersService();
				promises.push(usersService.findById(userId));
			}
			return Promise.all(promises).then(function (results) {
				var occasion = results[0];
				var user = userId ? results[1] : null;

				if (occasion) {
					occasion.owns = occasion.userId.equals(userId);

					let promises = [];

					var wishListService = new WishlistsService();
					promises.push(wishListService.index(occasion._id));

					if (user) {
						var OccasionSharesService = require('../services/OccasionSharesService');
						var occasionSharesService = new OccasionSharesService();
						promises.push(occasionSharesService.get(id, user.email));
					}

					return Promise.all(promises).then(function (results) {
						console.log(results);

						occasion.wishlists = results[0];

						if (results.length > 1) {
							occasion.sharedWithUser = results[1] || occasion.owns;
						}

						return occasion;
					}.bind(this)).catch(e => console.log(e));
				}
				return occasion;
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
	}

	/*
	id: unique identifier of the occasion document
	name: new name to update the occasion to (optional)
	occurrence: new name to update the occasion to (optional)
	*/
	update(userId, id, name, occurrence) {
		return this.owns(userId, id).then(function (res) {
			if (res) {
				return connect().then(function (client) {
					const db = client.db('wishlists');
					var objectId = new mongodb.ObjectID(id);
					var updateObject = {};
					if (name) { updateObject.name = name; }
					if (occurrence) { updateObject.occurrence = new Date(occurrence); }
					return db.collection(this.tableName).updateOne({_id: objectId}, {$set: updateObject}).then(function (result) {
							var value = result.value;
							client.close();
							return value;
					}.bind(this)).catch(e => console.log(e));
				}.bind(this)).catch(e => console.log(e));
			}
		}.bind(this)).catch(e => console.log(e));
	}

	/*
	id: the unique identifier of the occasion document
	*/
	delete(userId, id) {
		return this.owns(userId, id).then(function (res) {
			if (res) {
				return connect().then(function (client) {
					const db = client.db('wishlists');
					var objectId = new mongodb.ObjectID(id);
					var service = new WishlistsService();
					return service.deleteAssociated(objectId).then(function (success) {
						return db.collection(this.tableName).deleteOne({_id: objectId}).then(function () {
							console.log("Successfully deleted the occasion.");
							client.close();
						}.bind(this)).catch(function (err) {
							console.log(err);
							client.close();
						});
					}.bind(this)).catch(e => console.log(e));
				}.bind(this)).catch(e => console.log(e));
			}
		}.bind(this)).catch(e => console.log(e));
	}

	// checks if the requesting userId owns the occasion.
	owns(userId, id) {
		return connect().then(function (client) {
			if (!userId) {
				client.close();
				return false;
			}
			const db = client.db('wishlists');
			var objectId = new mongodb.ObjectID(id);
			return db.collection(this.tableName).findOne(objectId).then(function (occasion){
				if (occasion) {
					return occasion.userId.equals(userId);
				}
				else {
					return new Promise((result, reject) => reject("Unable to find that occasion."));
				}
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}
}