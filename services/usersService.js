'use strict'

var connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');

module.exports = class WishlistsService {
	constructor() {
		this.tableName = 'users';
	}

	findByEmail(email) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).findOne({ email: email }).then(
					function (user) {
						return user;
					},
					function (err) {
						console.log(err);
					}
				);
			}.bind(this)
		);
	}

	findById(id) {
		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var objectId = new mongodb.ObjectID(id);
				return db.collection(this.tableName).findOne({ _id: objectId }).then(
					function (user) {
						return user;
					},
					function (err) {
						console.log(err);
					}
				);
			}.bind(this)
		);
	}

	createUser(email, password, retypePassword) {
		if (password !== retypePassword) {
			return new Promise((resolve, reject) => {
				reject("Passwords do not match.");
			});
		}

		return connect().then(
			function (client) {
				const db = client.db('wishlists');
				var user = db.collection(this.tableName).findOne({email: email}).then(
					function (user) {
						if (user) {
							return new Promise((resolve, reject) => {
								reject("A user with that email already exists.");
							});
						}

						return db.collection(this.tableName).insertOne({
							email: email,
							password: password
						}).then(
							function (result) {
								client.close();
								return result.insertedId;
							}
						)
						.catch(
							function (error) {
								console.log("Can't connect to the users collection.");
								console.log(error);
								client.close();
							}
						);
					}.bind(this),
					function (err) {
						console.log(err);
						client.close();
					}
				);
			}.bind(this)
		);
	}

	updateEmail(email) {

	}

	updatePassword(currentPassword, newPassword, retypePassword) {
		
	}
}