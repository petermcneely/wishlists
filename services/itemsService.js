'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');

module.exports = class WishlistsService {
	constructor() {
		this.tableName = 'wishlistItems';
	}

	/*
	name: name of the wishlist item
	comments: comments on the wishlist item
	link: link to the wishlist item
	wishlistId: the unique identifier of the associated wishlist.
	*/
	create(name, comments, link, wishlistId) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).insertOne({
					name: name,
					comments: comments,
					link: link,
					wishlistId: new mongodb.ObjectID(wishlistId)
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

	index(userId, wishlistId) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).find({wishlistId: new mongodb.ObjectID(wishlistId)}).toArray().then(
					function (success) {
						success.forEach(function (e) {
							if (e.claimed && e.claimed.by.equals(userId)) {
								console.log(e.claimed.by);
								console.log(userId);
								e.claimedByUser = true;
							}
						}.bind(this));
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
	id: unique identifier of the wishlist item document
	*/
	get(id) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).findOne(objectId).then(
						function (wishlist) {
							return wishlist;
						}
					);
			}.bind(this)
		);
	}

	/*
	id: unique identifier of the wishlist item document
	name: new name to update the wishlist item to (optional)
	comments: new comments to update (optional)
	link: new link to update (optional)
	*/
	update(id, name, comments, link) {
		return connect().then(
			function (client) {
				var updateObject = {

				};
				if (name) {
					updateObject.name = name;
				}
				if (comments) {
					updateObject.comments = comments;
				}
				if (link) {
					updateObject.link = link;
				}

				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).updateOne(
					{_id: objectId},
					{$set: updateObject}
				).then(
					function (result) {
						var value = result.value;
						client.close();
						return value;
					}
				).catch(
					function (error) {
						client.close();
					}
				);
			}.bind(this)
		);
	}

	/*
	id: the unique identifier of the wishlist item document
	*/
	delete(id) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).deleteOne(
					{_id: objectId})
				.then(
					function () {
						console.log("Successfully deleted");
						client.close();
					}
				).catch(
					function (error) {
						console.log(error);
						client.close();
					}
				);
		}.bind(this));
	}

	/*
	wishlistIds: the unique identifiers of the associated wishlist document. Must be ObjectIDs.
	*/
	deleteAssociated(wishlistIds) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			return db.collection(this.tableName).deleteMany({wishlistId: {$in: wishlistIds}}).then(function () {
				console.log("Successfully deleted all items associated with the specified wishlists.");
				client.close();
			}.bind(this));
		}.bind(this));
	}

	claim(id, userId) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			console.log(id);
			return db.collection(this.tableName).updateOne(
				{_id: new mongodb.ObjectID(id)},
				{$set: {claimed: { by: userId, at: new Date()}}}).then(function (result) {
					if (result.writeConcernError) {
						return new Promise((res, rej) => rej(result.writeConcernError.errmsg));
					}
					else if (result.writeError) {
						return new Promise((res, rej) => rej(result.writeError.errmsg));
					}
					else {
						return new Promise((res, rej) => res("Successfully claimed the wishlist item!"));
					}
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
	}

	unclaim(id, userId) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			return db.collection(this.tableName).updateOne(
				{_id: new mongodb.ObjectID(id), "claimed.by" : userId},
				{$set: {claimed: null}}).then(function (result) {
					if (result.writeConcernError) {
						return new Promise((res, rej) => rej(result.writeConcernError.errmsg));
					}
					else if (result.writeError) {
						return new Promise((res, rej) => rej(result.writeError.errmsg));
					}
					else {
						return new Promise((res, rej) => res("Successfully unclaimed the wishlist item!"));
					}
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
	}
}