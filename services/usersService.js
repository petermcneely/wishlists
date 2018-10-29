'use strict'

var connect = require('../utils/mongoUtils');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

module.exports = class UsersService {
	constructor() {
		this.tableName = 'users';

		this.checkPassword = function (password) {
			let lengthRequirement = 8;

			if (!password || password.length < lengthRequirement) {
				return "Password needs to be at least eight characters long.";
			}

			let rules = [
				{
					pattern: RegExp(/\d/),
					message: "Pasword needs to have at least one number."
				},
				{
					pattern: RegExp(/[a-z]/),
					message: "Password needs to have at least one lower case letter."
				},
				{
					pattern: RegExp(/[A-Z]/),
					message: "Password needs to have at least one upper case letter."
				}
			];

			for (var i = 0; i < rules.length; ++i) {
				if (!rules[i].pattern.test(password)) {
					return rules[i].message;
				}				
			}

			return null;
		}
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

	getUsersById(ids) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			return db.collection(this.tableName).find({_id: {$in: ids}}).toArray().then(function (users) {
				client.close();
				return users;
			}.bind(this)).catch(e => console.log(e));
		}.bind(this)).catch(e => console.log(e));
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
				resolve({message: "Passwords do not match."});
			});
		}

		var message = this.checkPassword(password);
		if (message) {
			return new Promise((resolve, reject) => {
				resolve({message: message});
			})
		}
		else {
			return connect().then(function (client) {
				const db = client.db('wishlists');
				return db.collection(this.tableName).findOne({email: email}).then(function (user) {
					if (user) {
						client.close();
						return new Promise((res, rej) => {
							res({message: "A user with that email already exists."});
						});
					}

					return this.hashPassword(password).then(function (hash) {
						return this.saveUser(db, email, hash).then(function (result) {
							client.close();
							return result.insertedId;
						}.bind(this)).catch(function (e) {
							console.log(e);
							client.close();
						}.bind(this));
					}.bind(this)).catch(function (e) {
						console.log(e);
						client.close();
					}.bind(this));
				}.bind(this)).catch(function (e) {
					console.log(e);
					client.close();
				});
			}.bind(this)).catch(e => console.log(e));
		}		
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

	overwritePassword(email) {
		
	}

	updateEmail(email) {

	}

	updatePassword(currentPassword, newPassword, retypePassword) {
		
	}
}