'use strict'

var dal = require('../DAL/occasions');

module.exports = class WishlistsService {

	create(id, wishlistName, name, comments, link) {
		return dal.createItem(id, wishlistName, name, comments, link);
	}

	index(id, wishlistName, userId) {
		return dal.getItems(id, wishlistName, userId).then(wishlists => {
			wishlists.forEach(e => {
				if (e.claimed && e.claimed.by.equals(userId)) {
					e.claimedByUser = true;
				}
			});
			return wishlists;
		});
	}

	get(id, wishlistName, name) {
		return dal.getItem(id, wishlistName, name);
	}

	update(id, wishlistName, oldName, newName, comments, link) {
		var updateObject = {};
		if (name) {
			updateObject.name = newName;
		}
		if (comments) {
			updateObject.comments = comments;
		}
		if (link) {
			updateObject.link = link;
		}

		return dal.updateItem(id, wishlistName, oldName, updateObject);
	}

	delete(id, wishlistName, name) {
		return dal.deleteItem(id, wishlistName, name);
	}

	claim(id, wishlistName, name, userId) {
		return dal.claimItem(id, wishlistName, name, userId);
	}

	unclaim(id, wishlistName, name, userId) {
		return dal.unclaimItem(id, wishlistName, name, userId);
	}
}