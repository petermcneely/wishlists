'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');

module.exports = class OccasionsService {
	constructor() {
		this.tableName = 'occasions';
	}

	/*
	name: name of the occasion
	occurrence: date of the occasion
	*/
	create(name, occurrence) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).insertOne({
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
	id: unique identifier of the occasion document
	*/
	get(id) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).findOne(objectId).then(
						function (occasion) {
							return occasion;
						}
					);
			}.bind(this)
		);
	}

	/*
	id: unique identifier of the occasion document
	name: new name to update the occasion to (optional)
	occurrence: new name to update the occasion to (optional)
	*/
	update(id, name, occurrence) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				var updateObject = {};
				if (name){
					updateObject.name = name;
				}
				if (occurrence) {
					updateObject.occurrence = new Date(occurrence);
				}
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