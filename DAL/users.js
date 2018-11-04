'use strict'

const collection = require('./collection');
const mongodb = require('mongodb');

const tableName = 'users';

var findByEmail = function (email) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.findOne({email: email}).then(user => {
			this.client.close();
			return user;
		});
	}).catch(e => {
		console.log(e);
		this.client.close();
	});
}

var findById = function (id) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.findOne({_id: new mongodb.ObjectID(id)}).then(user => {
			this.client.close();
			return user;
		});
	}).catch(e => {
		console.log(e);
		this.client.close();
	});
}

var saveUser = function (email, hash) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.insertOne({email: email, password: hash, verified: false}).then(res => {
			this.client.close();
			return res;
		});
	}).catch(e => {
		console.log(e);
		this.client.close();
	});
}

var updateUser = function (query, where) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.updateOne(query, {$set: where}).then(res => {
			this.client.close();
			if (res.nModified === 0) {
				return Promise.reject("Unable to update the user; an internal error occurred.");
			}
			else {
				return Promise.resolve();
			}
		}).catch(e => {
			console.log(e);
			this.client.close();
		})
	});
}

module.exports = {
	findByEmail: findByEmail,
	findById: findById,
	saveUser: saveUser,
	updateUser: updateUser
}