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
			occurrence: 1,
			slug: 1
		}).toArray();
	});
}

var getOccasion = function (slug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			slug: slug
		});
	});
}

var updateOccasion = function (query, where) {
	return tcInstance.call(collection => {
		where.slug = slugme(where.name);
		return collection.updateOne({
			slug: query.slug,
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
			slug: query.slug,
			userId: new mongodb.ObjectID(query.userId)
		});
	});
}

var createOccasionShares = function (occasionSlug, emails) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug
		}, 
		{ 
			$addToSet: {
				shares: { 
					$each: emails 
				} 
			} 
		});
	});
}

var getOccasionShare = function (occasionSlug, email) {
	return tcInstance.call(collection => {
		return collection.findOne({
			slug: occasionSlug,
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

var deleteOccasionShare = function (occasionSlug, email) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug
		}, 
		{ 
			$pull: { 
				shares: email 
			} 
		});
	});
}

var createWishlist = function (userId, name, occasionSlug) {
	return tcInstance.call(collection => {
		return getWishlist(occasionSlug, slugme(name)).then(occasion => {
			if (occasion.wishlists && occasion.wishlists.length) {
				return Promise.resolve({message: "A wishlist with that name already exists."});
			}
			else {
				return collection.updateOne({
					slug: occasionSlug
				}, 
				{ 
					$addToSet: { 
						wishlists: { 
							name: name,
							slug: slugme(name), 
							userId: new mongodb.ObjectID(userId) 
						} 
					} 
				});
			}
		});
	});
}

var getWishlists = function (occasionSlug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			slug: occasionSlug
		}, 
		{
			projection: {
				wishlists: 1,
				slug: 1
			}
		});
	});
}

var getWishlist = function (occasionSlug, wishlistSlug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			slug: occasionSlug
		}, 
		{
			projection: {
				wishlists: {
					$elemMatch: {
						slug: wishlistSlug
					}
				}, 
				shares: 1, 
				userId: 1,
				slug: 1
			}
		});
	});
}

var updateWishlist = function (occasionSlug, userId, wishlistSlug, newName) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug,
			wishlists: {
				$elemMatch: {
					userId: new mongodb.ObjectID(userId),
				 	slug: wishlistSlug
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

var deleteWishlist = function (occasionSlug, userId, slug) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug,
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

var createItem = function (occasionSlug, wishlistSlug, name, comments, link) {
	return tcInstance.call(collection => {
		return getItem(occasionSlug, wishlistSlug, slugme(name)).then(item => {
			if (item) {
				return Promise.resolve({message: "An item with that name already exists."});
			}
			else {
				return collection.updateOne({
					slug: occasionSlug,
					"wishlists.slug": wishlistSlug
				}, 
				{
					$addToSet: {
						"wishlists.$.items": {
							name: name, 
							comments: comments, 
							link: link,
							slug: slugme(name)
						}
					}
				});
			}
		});		
	});
}

var getItems = function (occasionSlug, wishlistSlug, userId) {
	return tcInstance.call(collection => {
		return collection.find({
			slug: occasionSlug,
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

var getItem = function (occasionSlug, wishlistSlug, itemSlug) {
	return tcInstance.call(collection => {
		return collection.findOne({
			slug: occasionSlug,
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
			if (occasion && occasion.wishlists && occasion.wishlists.length && occasion.wishlists[0].items) {
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
			return Promise.resolve();
		});
	});
}

var updateItem = function (occasionSlug, wishlistSlug, itemSlug, updateObject) {
	return tcInstance.call(collection => {
		updateObject.slug = slugme(updateObject.name);
		return collection.updateOne({
			slug: occasionSlug,
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

var deleteItem = function (occasionSlug, wishlistSlug, itemSlug) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug,
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

var claimItem = function (occasionSlug, wishlistSlug, itemSlug, userId) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug,
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

var unclaimItem = function (occasionSlug, wishlistSlug, itemSlug, userId) {
	return tcInstance.call(collection => {
		return collection.updateOne({
			slug: occasionSlug,
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