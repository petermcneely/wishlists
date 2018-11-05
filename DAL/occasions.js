'use strict'

const collection = require('./collection');
const mongodb = require('mongodb');

const tableName = 'occasions';

var createOccasion = function (userId, name, occurrence) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.insertOne({userId: new mongodb.ObjectID(userId), name: name, occurrence: new Date(occurrence)}).then(result => {
			this.client.close();
			return result.insertedId;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var getOccasions = function () {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.find({}, {name: 1, occurrence: 1}).toArray().then(occasions => {
			this.client.close();
			return occasions;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var getOccasion = function (id) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.findOne(new mongodb.ObjectID(id), {name: 1, occurrence: 1}).then(occasion => {
			this.client.close();
			return occasion;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var updateOccasion = function (query, where) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.updateOne(query, {$set: where}).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var deleteOccasion = function (query) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.deleteOne(query).then(() => {
			this.client.close();
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var createOccasionShares = function (id, emails) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.updateOne({_id: new mongodb.ObjectID(id)}, { $push: { shares: { $each: emails } } }).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var getOccasionShare = function (id, email) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.findOne({_id: new mongodb.ObjectID(id), shares: email}, { "shares.$": 1 }).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var deleteOccasionShare = function (id, email) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.updateOne({_id: new mongodb.ObjectID(id)}, { $pull: { shares: email } }).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var createWishlist = function (userId, name, occasionId) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.updateOne({_id: new mongodb.ObjectID(occasionId)}, { $push: { wishlists: { name: name, userId: new mongodb.ObjectID(userId) } } }).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

var getWishlists = function (id) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return obj.collection.findOne({_id: new mongodb.ObjectID(id)}, {wishlists: 1}).then(result => {
			this.client.close();
			return result;
		});
	}).catch(e => {
		console.log(e);
		if (this.client) this.client.close();
	});
}

module.exports = {
	createOccasion: createOccasion,
	getOccasions: getOccasions,
	getOccasion: getOccasion,
	updateOccasion: updateOccasion,
	deleteOccasion: deleteOccasion,
	createOccasionShares: createOccasionShares,
	getOccasionShare: getOccasionShare,
	deleteOccasionShare: deleteOccasionShare,
	createWishlist: createWishlist,
}