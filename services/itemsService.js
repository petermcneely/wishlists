'use strict'

var dal = require('../DAL/occasions');

module.exports = class ItemsService {

	create(occasionSlug, wishlistSlug, name, comments, link) {
		return dal.createItem(occasionSlug, wishlistSlug, name, comments, link);
	}

	get(occasionSlug, wishlistSlug, itemSlug, userId) {
		return dal.getItem(occasionSlug, wishlistSlug, itemSlug).then(response => {
			if (response) {
				response.item.owns = response.userId.equals(userId);
				response.item.occasion = response.occasion;
				return response.item;	
			}
		});
	}

	update(occasionSlug, wishlistSlug, itemSlug, newName, comments, link) {
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

		return dal.updateItem(occasionSlug, wishlistSlug, itemSlug, updateObject);
	}

	delete(occasionSlug, wishlistSlug, itemSlug) {
		return dal.deleteItem(occasionSlug, wishlistSlug, itemSlug);
	}

	claim(occasionSlug, wishlistSlug, itemSlug, userId) {
		return dal.claimItem(occasionSlug, wishlistSlug, itemSlug, userId);
	}

	unclaim(occasionSlug, wishlistSlug, itemSlug, userId) {
		return dal.unclaimItem(occasionSlug, wishlistSlug, itemSlug, userId);
	}
}