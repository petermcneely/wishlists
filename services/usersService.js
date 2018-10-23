'use strict'

var connect = require('../utils/mongoUtils');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

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

		return connect().then(function (client) {
			const db = client.db('wishlists');
			var user = db.collection(this.tableName).findOne({email: email}, function (err, user) {
				if (err) {
					console.log(err);
					client.close();
				}
				else {
					if (user) {
						client.close();
						return new Promise((resolve, reject) => {
							reject("A user with that email already exists.");
						});
					}

					this.hashPassword(password, function (err, hash) {
						if (err) {
							console.log(err);
							client.close();
						}
						else {
							this.saveUser(db, email, hash, function (err, result) {
								client.close();
								if (err) {
									console.log(err);
								}
								else {
									return result.insertedId;
								}
							});
						}
					}.bind(this));
				}
			}.bind(this));
		}.bind(this)).catch(function (err) {
			console.log(err);
		});
	}

	hashPassword(password, callback) {
		bcrypt.hash(password, 10, callback);
	}

	saveUser(db, email, hash, callback) {
		db.collection(this.tableName).insertOne({
			email: email,
			password: hash
		}, callback);
	}

	updateEmail(email) {

	}

	updatePassword(currentPassword, newPassword, retypePassword) {
		
	}
}