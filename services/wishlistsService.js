'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');
var ItemsService = require('./ItemsService');

module.exports = class WishlistsService {
	constructor() {
		this.tableName = 'wishlists';
	}

	/*
	name: name of the wishlist
	occasionId: the unique identifier of the associated occasion.
	*/
	create(name, occasionId) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).insertOne({
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
	id: unique identifier of the wishlist document
	*/
	get(id) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).findOne(objectId).then(
						function (wishlist) {
							var service = new ItemsService();
							return service.index(wishlist._id).then(
								function (items) {
									wishlist.items = items;
									return wishlist;
								}.bind(this)
							);
						}.bind(this)
					);
			}.bind(this)
		);
	}

	/*
	id: unique identifier of the wishlist document
	name: new name to update the wishlist to (required)
	*/
	update(id, name) {
		return connect().then(
			function (client) {
				if (!name)
					return null;

				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).updateOne(
					{_id: objectId},
					{$set: {name: name}}
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
	id: the unique identifier of the occasion document
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
}