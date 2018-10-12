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
					occurrence: occurrence
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
						console.log(success);
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
					updateObject.occurrence = occurrence;
				}

				return db.collection(this.tableName).findOneAndUpdate(
					objectId,
					{$set: updateObject},
					{returnOriginal: false}
				).then(
					function (result) {
						var value = result.value;
						console.log("Successfully updated the document.");
						console.log(result);
						client.close();
						return value;
					}
				).catch(
					function (error) {
						console.log("Can't update document.");
						console.log(error);
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
				return db.collection(this.tableName).findOneAndDelete(objectId)
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