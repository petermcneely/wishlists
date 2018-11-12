'use strict'

const occasionDal = require('../DAL/occasions');
const userDal = require('../DAL/users');

module.exports = class WishlistsService {
	/*
	userId: the id of the creating user.
	name: name of the wishlist
	occasionId: the unique identifier of the associated occasion.
	*/
	create(userId, occasionId, name) {
		return occasionDal.createWishlist(userId, name, occasionId);
	}

	/*
	userId: unique identifier of the requesting user
	occasionId: unique identifier of the owning occasion
	slug: unique slug of the wishlist in this occasion
	*/
	get(userId, occasionId, slug) {
		let promises = [
			userDal.findById(userId),
			occasionDal.getWishlist(occasionId, slug)
		];

		return Promise.all(promises).then(results => {
			let user = results[0];
			let occasion = results[1];
			if (occasion && occasion.wishlists && occasion.wishlists.length) {
				let wishlist = occasion.wishlists[0];

				// Handle owns
				wishlist.owns = wishlist.userId.equals(userId);

				// Handle shared with user.
				wishlist.sharedWithUser = false;
				if (occasion.shares && user) {
					occasion.shares.forEach(element => {
						wishlist.sharedWithUser = wishlist.sharedWithUser || element === user.email;
					});
				}
				wishlist.sharedWithUser = wishlist.sharedWithUser || occasion.userId.equals(userId);
				wishlist.occasion = {
					slug: occasion.slug
				};
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
	slug: the wishlist's current, unique slug
	newName: the wishlist's new name
	*/
	update(userId, occasionId, slug, newName) {
		return occasionDal.updateWishlist(occasionId, userId, slug, newName);
	}

	/*
	occasionId: unique identifier of the owning occasion
	userId: the id of the requesting user; should own the wishlist
	slug: the unique slug of the wishlist to delete
	*/
	delete(userId, occasionId, slug) {
		return occasionDal.deleteWishlist(occasionId, userId, slug);
	}
}