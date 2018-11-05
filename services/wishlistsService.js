'use strict'

const dal = require('../DAL/occasions');

module.exports = class WishlistsService {
	/*
	userId: the id of the creating user.
	name: name of the wishlist
	occasionId: the unique identifier of the associated occasion.
	*/
	create(userId, name, occasionId) {
		return dal.createWishlist(userId, name, occasionId);
	}

	index(occasionId) {
		return dal.getWishlists(occasionId);
	}

	/*
	userId: unique identifier of the requesting user
	id: unique identifier of the wishlist document
	*/
	get(userId, id) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			var objectId = new mongodb.ObjectID(id);

			let UsersService = require('./UsersService');
			let usersService = new UsersService();

			let promises = [];

			promises.push(db.collection(this.tableName).findOne(objectId));
			promises.push(usersService.findById(userId));

			return Promise.all(promises).then(function (results){
				let wishlist = results[0];
				let user = results[1];
				if (wishlist) {
					wishlist.owns = wishlist.userId.equals(userId);

					let itemsService = new ItemsService();
					let OccasionsService = require('./OccasionsService');
					let occasionsService = new OccasionsService();
					let promises = [];
					promises.push(itemsService.index(userId, wishlist._id));
					promises.push(occasionsService.owns(userId, wishlist.occasionId));

					if (user) {
						let OccasionSharesService = require('./OccasionSharesService');
						let occasionSharesService = new OccasionSharesService();
						promises.push(occasionSharesService.get(wishlist.occasionId.toString(), user.email));
					}

					return Promise.all(promises).then(function (results) {
						wishlist.items = results[0];
						wishlist.sharedWithUser = (results[2] !== null) || results[1];
						return wishlist;
					}.bind(this)).catch(e => console.log(e));
				}
				else {
					return new Promise((res, rej) => rej("Unable to find that wishlist."));
				}
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
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