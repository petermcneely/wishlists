'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');
var ItemsService = require('./ItemsService');

module.exports = class WishlistsService {
	constructor() {
		this.tableName = 'wishlists';
	}

	/*
	userId: the id of the creating user.
	name: name of the wishlist
	occasionId: the unique identifier of the associated occasion.
	*/
	create(userId, name, occasionId) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).insertOne({
					userId: new mongodb.ObjectID(userId),
					name: name,
					occasionId: new mongodb.ObjectID(occasionId)
				}).then(
					function (result) {
						client.close();
						return result.insertedId;
					}
				)
				.catch(
					function (error) {
						console.log("Can't connect to the wishlists collection.");
						console.log(error);
						client.close();
					}
				);
			}.bind(this)
		);
	}

	index(occasionId) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).find({occasionId: new mongodb.ObjectID(occasionId)}).toArray().then(
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
	id: unique identifier of the wishlist document
	*/
	get(userId, id) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			var objectId = new mongodb.ObjectID(id);
			return db.collection(this.tableName).findOne(objectId).then(function (wishlist) {
				if (wishlist) {
					wishlist.owns = wishlist.userId.equals(userId);
					var service = new ItemsService();
					return service.index(wishlist._id).then(function (items) {
						wishlist.items = items;
						return wishlist;
					}.bind(this)).catch(err => console.log(err));
				}
				else {
					return new Promise((res, rej) => rej("Unable to find that wishlist."));
				}
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}

	/*
	id: unique identifier of the wishlist document
	name: new name to update the wishlist to (required)
	*/
	update(userId, id, name) {
		return this.owns(userId, id).then(function (res) {
			if (res) {
				return connect().then(function (client) {
					if (!name)
						return null;

					const db = client.db('wishlists');
					var objectId = new mongodb.ObjectID(id);
					return db.collection(this.tableName).updateOne({_id: objectId}, {$set: {name: name}}).then(function (result) {
						var value = result.value;
						client.close();
						return value;
					}.bind(this)).catch((e) => {
						client.close();
						console.log(e);
					});
				}.bind(this)).catch(e => console.log(e));
			}
		}.bind(this)).catch(e => console.log(e));
	}

	/*
	id: the unique identifier of the wishlist document
	*/
	delete(userId, id) {
		return this.owns(userId, id).then(function (res) {
			if (res) {
				return connect().then(function (client) {
					const db = client.db('wishlists');
					var objectId = new mongodb.ObjectID(id);
					var service = new ItemsService();
					return service.deleteAssociated([objectId]).then(function (success) {
						db.collection(this.tableName).deleteOne({_id: objectId}).then(function () {
							console.log("Successfully deleted the wishlist.");
							client.close();
						}).catch(function(err){
							console.log(error);
							client.close();
						});
					}.bind(this)).catch(e => console.log(e));
				}.bind(this)).catch(e => console.log(e));
			}
		}.bind(this)).catch(e => console.log(e));
	}

	/*
	occasionId: the unique identifier of the associated occasion document. Must be an ObjectID
	*/
	deleteAssociated(occasionId) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).find({occasionId: occasionId}).toArray().then(function (results) {
				var service = new ItemsService();
				service.deleteAssociated(results.map(e => e._id)).then(function () {
					db.collection(this.tableName).deleteMany({occasionId: occasionId}).then(function (success) {
						console.log("Successully deleted the associated wishlists.");
						client.close();
					}.bind(this)).catch(function (err) {
						console.log(err);
						client.close();
					});
				}.bind(this)).catch(function (err) {
					console.log(err);
					client.close();
				});
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
	}

	// checks if the requesting userId owns the wishlist
	owns(userId, id) {
		return connect().then(function(client) {
			if (!userId) {
				client.close();
				return false;
			}
			const db = client.db('wishlists');
			var objectId = new mongodb.ObjectID(id);
			return db.collection(this.tableName).findOne(objectId).then(function (wishlist) {
				if (wishlist) {
					return wishlist.userId.equals(userId);
				}
				else {
					return new Promise((result, reject) => reject("Unable to find that wishlist."));
				}
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}
}