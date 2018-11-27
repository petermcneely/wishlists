'use strict'

const occasionDal = require('../DAL/occasions');
const userDal = require('../DAL/users');

module.exports = class WishlistsService {
	/*
	userId: the id of the creating user.
	name: name of the wishlist
	occasionSlug: the unique identifier of the associated occasion.
	*/
	create(userId, occasionSlug, name) {
		return occasionDal.createWishlist(userId, name, occasionSlug);
	}

	/*
	userId: unique identifier of the requesting user
	occasionSlug: unique identifier of the owning occasion
	slug: unique slug of the wishlist in this occasion
	*/
	get(userId, occasionSlug, slug) {
		let promises = [
			userDal.findById(userId),
			occasionDal.getWishlist(occasionSlug, slug)
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

				if (wishlist.items && wishlist.items.length) {
					for (let i = 0; i < wishlist.items.length; ++i) {
						if (wishlist.items[i].claimed) {
							wishlist.items[i].claimedByUser = wishlist.items[i].claimed.by.equals(userId);
						}
					}
				}
				return wishlist;
			}
			else {
				return null;
			}
		});
	}

	/*
	occasionSlug: unique identifier of the owning occasion
	userId: the id of the requesting user; should own the wishlist
	slug: the wishlist's current, unique slug
	newName: the wishlist's new name
	*/
	update(userId, occasionSlug, slug, newName) {
		return occasionDal.updateWishlist(occasionSlug, userId, slug, newName);
	}

	/*
	occasionSlug: unique identifier of the owning occasion
	userId: the id of the requesting user; should own the wishlist
	slug: the unique slug of the wishlist to delete
	*/
	delete(userId, occasionSlug, slug) {
		return occasionDal.deleteWishlist(occasionSlug, userId, slug);
	}
}