'use strict'

const dal = require('../DAL/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto-promise');
const checkPassword = require('../utils/passwordChecker');

module.exports = class UsersService {
	constructor() {
		this.checkPassword = function (password) {
			return checkPassword(password);
		}
	}

	findByEmail(email) {
		return dal.findByEmail(email);
	}

	findById(id) {
		return dal.findById(id);
	}

	createUser(email, password, retypePassword) {
		if (password !== retypePassword) {
			return Promise.resolve({message: "Passwords do not match."});
		}

		var message = this.checkPassword(password);
		if (message) {
			return Promise.resolve({message: message});
		}
		else {
			return dal.findByEmail(email).then(user => {
				if (user) {
					return Promise.resolve({message: "A user with that email already exists."});
				}
				else {
					return this.hashPassword(password).then(hash => {
						return dal.saveUser(email, hash).then(result => {
							return result.insertedId;
						});
					});
				}
			});
		}		
	}

	hashPassword(password) {
		return bcrypt.hash(password, 10);
	}

	encryptVerificationParameters(email) {
		return crypto.cipher('aes256', process.env.CRYPTO_SECRET)(email);
	}

	decryptVerificationParameters(encrypted) {
		return crypto.decipher('aes256', process.env.CRYPTO_SECRET)(encrypted, 'hex');
	}

	overwritePassword(email, callback) {
		let passwordGenerator = require('generate-password');
		var newPassword = passwordGenerator.generate({length: 12, numbers: true, uppercase: true, strict: true});
		return this.hashPassword(newPassword).then(hash => {
			var date = new Date();
			date.setDate(date.getDate() + 1);
            return dal.updateUser({ email: email }, { password: hash, passwordExpiry: date }).then(() => {
                return newPassword;
            });
		});
	}

	changePassword(currentPassword, newPassword, newRetypePassword, userId) {
		if (newPassword !== newRetypePassword) {
			return Promise.resolve({message: "Passwords do not match."});
		}

		var message = this.checkPassword(newPassword);
		if (message) {
			return Promise.resolve({message: message});
		}
		else {
			return this.hashPassword(newPassword).then(hash => {
				return dal.updateUser({_id: userId}, {password: hash, passwordExpiry: null});
			});
		}
	}

	changeEmail(email, userId) {
		return dal.updateUser({_id: userId}, {email: email});
	}

	verify(token) {
		return this.decryptVerificationParameters(token).then(email => {
			if (email.toString()) {
				return dal.updateUser({email: email.toString()}, {verified: true});
			}
			else {
				return Promise.reject({message: "No valid token was sent to verify."});
			}
		});
	}
}