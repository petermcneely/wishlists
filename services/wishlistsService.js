'use strict'

const occasionDal = require('../DAL/occasions');
const userDal = require('../DAL/users');

module.exports = class WishlistsService {
	/*
	userId: the id of the creating user.
	name: name of the wishlist
	occasionId: the unique identifier of the associated occasion.
	*/
	create(userId, name, occasionId) {
		return occasionDal.createWishlist(userId, name, occasionId);
	}

	index(occasionId) {
		return occasionDal.getWishlists(occasionId);
	}

	/*
	userId: unique identifier of the requesting user
	occasionId: unique identifier of the owning occasion
	name: unique name of the wishlist in this occasion
	*/
	get(userId, occasionId, name) {
		let promises = [
			userDal.findById(userId),
			occasionDal.getWishlist(id)
		];

		return Promise.all(promises).then(results => {
			let user = results[0];
			let occasion = results[1];
			if (occasion && occasion.wishlists && occasion.wishlist.length) {
				let wishlist = occasion.wishlist[0];

				// Handle owns
				wishlist.owns = wishlist.userId.equals(userId);

				// Handle shared with user.
				wishlist.sharedWithUser = false;
				if (occasion.shares) {
					occasion.shares.forEach(element => {
						wishlist.sharedWithUser = wishlist.sharedWithUser || element === user.email;
					});
				}
				wishlist.sharedWithUser = wishlist.sharedWithUser || occasion.userId.equals(userId);
				return wishlist;
			}
			else {
				return null;
			}
		});
	}

	/*
	occasionId: unique identifier of the owning occasion
	userId: the id of the requesting user; should own the wishlist
	oldName: the wishlist's old name
	newName: the wishlist's new name
	*/
	update(occasionId, userId, oldName, newName) {
		return occasionDal.updateWishlist(occasionId, userId, oldName, newName);
	}

	/*
	occasionId: unique identifier of the owning occasion
	userId: the id of the requesting user; should own the wishlist
	name: the name of the wishlist to delete
	*/
	delete(occasionId, userId, name) {
		return occasionDal.deleteWishlist(occasionId, userId, name);
	}
}