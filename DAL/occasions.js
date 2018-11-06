'use strict'

const collection = require('./collection');
const mongodb = require('mongodb');

const tableName = 'occasions';

var boilerPlate = function (cb) {
	this.client = null;
	return collection(tableName).then(obj => {
		this.client = obj.client;
		return cb(obj.collection).then(result => {
			this.client.close();
			return result;
		}).catch(e => {
			console.log(e);
			if (this.client) this.client.close();
		});
	});
}

var createOccasion = function (userId, name, occurrence) {
	return boilerPlate(collection => {
		return collection.insertOne({userId: new mongodb.ObjectID(userId), name: name, occurrence: new Date(occurrence)});
	});
}

var getOccasions = function () {
	return boilerPlate(collection => {
		return collection.find({}, {name: 1, occurrence: 1}).toArray();
	});
}

var getOccasion = function (id) {
	return boilerPlate(collection => {
		return collection.findOne(new mongodb.ObjectID(id), {name: 1, occurrence: 1});
	});
}

var updateOccasion = function (query, where) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(query.id), userId: new mongodb.ObjectID(query.userId)}, {$set: where});
	});
}

var deleteOccasion = function (query) {
	return boilerPlate(collection => {
		return collection.deleteOne({_id: new mongodb.ObjectID(query.id), userId: new mongodb.ObjectID(query.userId)});
	});
}

var createOccasionShares = function (id, emails) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(id)}, { $push: { shares: { $each: emails } } });
	});
}

var getOccasionShare = function (id, email) {
	return boilerPlate(collection => {
		return collection.findOne({_id: new mongodb.ObjectID(id), shares: email}, { "shares.$": 1 });
	});
}

var deleteOccasionShare = function (id, email) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(id)}, { $pull: { shares: email } });
	});
}

var createWishlist = function (userId, name, occasionId) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(occasionId)}, { $push: { wishlists: { name: name, userId: new mongodb.ObjectID(userId) } } });
	});
}

var getWishlists = function (id) {
	return boilerPlate(collection => {
		return collection.findOne({_id: new mongodb.ObjectID(id)}, {wishlists: 1});
	});
}

var getWishlist = function (id, name) {
	return boilerPlate(collection => {
		return collection.findOne({_id: new mongodb.ObjectID(id), "wishlists.name": name}, {"wishlists.$": 1, shares: 1});
	});
}

var updateWishlist = function (id, userId, oldName, newName) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(id), "wishlists.userId": new mongodb.ObjectID(userId), "wishlists.name": oldName}, {$set: {"wishlists.$.name": newName}});
	});
}

var deleteWishlist = function (id, userId, name) {
	return boilerPlate(collection => {
		return collection.deleteOne({_id: new mongodb.ObjectID(id), "wishlists.userId": new mongodb.ObjectID(userId), "wishlists.name": name});
	});
}

var createItem = function (id, wishlistName, name, comments, link) {
	return boilerPlate(collection => {
		return collection.updateOne({_id: new mongodb.ObjectID(id), "wishlists.name": wishlistname}, {$push: {items: {name: name, comments: comments, link: link}}});
	});
}

var getItems = function (id, wishlistName, userId) {
	return boilerPlate(collection => {
		return collection.find({_id: new mongodb.ObjectID(id), "wishlists.name" wishlistName}, {"wishlists.items": 1});
	});
}

var getItem = function (id, wishlistName, name) {
	return boilerPlate(collection => {
		return collection.findOne({_id: newMongodb.ObjectID(id), "wishlists.name": wishlistName, "wishlists.items.name": name}, {"wishlists.items.$": 1});
	});
}

var updateItem = function (id, wishlistName, oldName, newName, comments, link) {
	return boilerPlate(collection => {
		return;
	});
}

var deleteItem = function (id, wishlistName, name) {
	return boilerPlate(collection => {
		return;
	});
}

var claimItem = function (id, wishlistName, name, userId) {
	return boilerPlate(collection => {
		return;
	});
}

var unclaimItem = function (id, wishlistName, name, userId) {
	return boilerPlate(collection => {
		return;
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
	getWishlists: getWishlists,
	getWishlist: getWishlist,
	updateWishlist: updateWishlist,
	deleteWishlist: deleteWishlist,
	createItem: createItem,
	getItems: getItems,
	getItem: getItem,
	updateItem: updateItem,
	deleteItem: deleteItem,
	claimItem: claimItem,
	unclaimItem: unclaimItem
}