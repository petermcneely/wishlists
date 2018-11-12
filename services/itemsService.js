'use strict'

var dal = require('../DAL/occasions');

module.exports = class ItemsService {

	create(id, wishlistSlug, name, comments, link) {
		return dal.createItem(id, wishlistSlug, name, comments, link);
	}

	get(id, wishlistSlug, itemSlug, userId) {
		return dal.getItem(id, wishlistSlug, itemSlug).then(response => {
			if (response) {
				response.item.owns = response.userId.equals(userId);
				response.item.occasion = response.occasion;
				return response.item;	
			}
		});
	}

	update(id, wishlistSlug, itemSlug, newName, comments, link) {
		var updateObject = {};
		if (newName) {
			updateObject.name = newName;
		}
		if (comments) {
			updateObject.comments = comments;
		}
		if (link) {
			updateObject.link = link;
		}

		return dal.updateItem(id, wishlistSlug, itemSlug, updateObject);
	}

	delete(id, wishlistSlug, itemSlug) {
		return dal.deleteItem(id, wishlistSlug, itemSlug);
	}

	claim(id, wishlistSlug, itemSlug, userId) {
		return dal.claimItem(id, wishlistSlug, itemSlug, userId);
	}

	unclaim(id, wishlistSlug, itemSlug, userId) {
		return dal.unclaimItem(id, wishlistSlug, itemSlug, userId);
	}
}