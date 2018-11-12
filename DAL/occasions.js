'use strict'

const mongodb = require('mongodb');
const slugify = require('slugify');
const TableCall = require('./tableCall');

const tcInstance = new TableCall("occasions");

var slugme = function (input) {
	return slugify(input, {replacement: "-", remove: /[*+~.()'"!:@]/g, lower: true});
}

var createOccasion = function (userId, name, occurrence) {
	return tcInstance.call(collection => {
		return collection.insertOne({
			userId: new mongodb.ObjectID(userId),
			name: name, 
			slug: slugme(name),
			occurrence: new Date(occurrence)
		});
	});
}

var getOccasions = function () {
	return tcInstance.call(collection => {
		return collection.find({

		}, 
		{
			name: 1, 
			occurrence: 1
		}).toArray();
	});
}

var getOccasion = function (id) {
	return tcInstance.call(collection => {
		return collection.findOne(new mongodb.ObjectID(id));
	});
}

var updateOccasion = function (query, where) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(query.id), 
			userId: new mongodb.ObjectID(query.userId)
		}, 
		{
			$set: where
		});
	});
}

var deleteOccasion = function (query) {
	return tcInstance.call(collection => {
		return collection.deleteOne({
			_id: new mongodb.ObjectID(query.id), 
			userId: new mongodb.ObjectID(query.userId)
		});
	});
}

var createOccasionShares = function (id, emails) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id)
		}, 
		{ 
			$push: {
				shares: { 
					$each: emails 
				} 
			} 
		});
	});
}

var getOccasionShare = function (id, email) {
	return tcInstance.call(collection => {
		return collection.findOne({
			_id: new mongodb.ObjectID(id), 
			shares: email
		}, 
		{
			projection: { 
				"shares.$": 1,
				slug: 1 
			}
		});
	});
}

var deleteOccasionShare = function (id, email) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id)
		}, 
		{ 
			$pull: { 
				shares: email 
			} 
		});
	});
}

var createWishlist = function (userId, name, occasionId) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(occasionId)
		}, 
		{ 
			$push: { 
				wishlists: { 
					name: name,
					slug: slugme(name), 
					userId: new mongodb.ObjectID(userId) 
				} 
			} 
		});
	});
}

var getWishlists = function (id) {
	return tcInstance.call(collection => {
		return collection.findOne({
			_id: new mongodb.ObjectID(id)
		}, 
		{
			projection: {
				wishlists: 1,
				slug: 1
			}
		});
	});
}

var getWishlist = function (id, slug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			_id: new mongodb.ObjectID(id)
		}, 
		{
			projection: {
				wishlists: {
					$elemMatch: {
						slug: slug
					}
				}, 
				shares: 1, 
				userId: 1,
				slug: 1
			}
		});
	});
}

var updateWishlist = function (id, userId, slug, newName) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			wishlists: {
				$elemMatch: {
					userId: new mongodb.ObjectID(userId),
				 	slug: slug
				}
			}
		},
		{
			$set: {
				"wishlists.$.name": newName,
				"wishlists.$.slug": slugme(newName)
			}
		});
	});
}

var deleteWishlist = function (id, userId, slug) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			"wishlists.userId": new mongodb.ObjectID(userId)
		}, 
		{
			$pull: {
				wishlists: {
					slug: slug
				}
			}
		});
	});
}

var createItem = function (id, wishlistSlug, name, comments, link) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			"wishlists.slug": wishlistSlug
		}, 
		{
			$push: {
				"wishlists.$.items": {
					name: name, 
					comments: comments, 
					link: link,
					slug: slugme(name)
				}
			}
		});
	});
}

var getItems = function (id, wishlistSlug, userId) {
	return tcInstance.call(collection => {
		return collection.find({
			_id: new mongodb.ObjectID(id), 
			"wishlists.slug": wishlistSlug
		}, 
		{
			projection: {
				"wishlists.$.items": 1,
				slug: 1
			}
		});
	});
}

var getItem = function (id, wishlistSlug, itemSlug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			_id: new mongodb.ObjectID(id), 
			"wishlists.slug": wishlistSlug
		},
		{
			projection: {
				wishlists: {
					$elemMatch: {
						slug: wishlistSlug
					}
				},
				slug: 1
			}
		}).then(occasion => {
			if (occasion && occasion.wishlists && occasion.wishlists.length) {
				for (var i = 0; i < occasion.wishlists[0].items.length; ++i) {
					if (occasion.wishlists[0].items[i].slug === itemSlug) {
						return Promise.resolve({
							item: occasion.wishlists[0].items[i], 
							userId: occasion.wishlists[0].userId,
							occasion: {
								id: occasion._id,
								slug: occasion.slug
							}
						});
					}
				}
			}
			return Promise.reject();
		});
	});
}

var updateItem = function (id, wishlistSlug, itemSlug, updateObject) {
	return tcInstance.call(collection => {
		updateObject.slug = slugme(updateObject.name);
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			wishlists: {
				$elemMatch: {
					slug: wishlistSlug, 
					"items.slug": itemSlug
				}
			}
		}, 
		{
			$set: {
				"wishlists.$[outer].items.$[inner]": updateObject
			}
		}, 
		{
			arrayFilters: [
				{"outer.slug": wishlistSlug}, 
				{"inner.slug": itemSlug}
			]
		});
	});
}

var deleteItem = function (id, wishlistSlug, itemSlug) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			wishlists: {
				$elemMatch: {
					slug: wishlistSlug
				}
			}
		}, 
		{
			$pull: {
				"wishlists.$[outer].items": {
					slug: itemSlug
				}
			}
		}, 
		{
			arrayFilters: [
				{"outer.slug": wishlistSlug}
			]
		});
	});
}

var claimItem = function (id, wishlistSlug, itemSlug, userId) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			wishlists: {
				$elemMatch: {
					slug: wishlistSlug, 
					"items.slug": itemSlug
				}
			}
		}, 
		{
			$set: {
				"wishlists.$[outer].items.$[inner].claimed": {
					by: new mongodb.ObjectID(userId),
					at: new Date()
				}
			}
		}, 
		{
			arrayFilters: [
				{"outer.slug": wishlistSlug}, 
				{"inner.slug": itemSlug}
			]
		});
	});
}

var unclaimItem = function (id, wishlistSlug, itemSlug, userId) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			_id: new mongodb.ObjectID(id), 
			wishlists: {
				$elemMatch: {
					slug: wishlistSlug,
					items: {
						$elemMatch: {
							slug: itemSlug,
							"claimed.by": new mongodb.ObjectID(userId)
						}
					}
				}
			}
		}, 
		{
			$set: {
				"wishlists.$[outer].items.$[inner].claimed": null
			}
		}, 
		{
			arrayFilters: [
				{"outer.slug": wishlistSlug}, 
				{"inner.slug": itemSlug}
			]
		});
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