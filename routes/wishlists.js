'use strict'

var express = require('express');
var router = express.Router();
var urlencodedParser = express.urlencoded({extended: true});
var WishlistsService = require('../services/wishlistsService');

/* GET wishlist. */
router.get('/:occasionId([a-zA-Z0-9]{24})/wishlists/:wishlistId([a-zA-Z0-9]{24})', function (req, res) {
	if (!req.params || !req.params.wishlistId) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required wishlistId parameter.'});
	}
	var service = new WishlistsService();
	service.get(req.params.wishlistId).then(
		function (wishlist) {
			if (wishlist) {
				res.render('templates/shell', {partials: {page: '../wishlists/details'}, title: wishlist.name + ' - Wishlists', wishlist: wishlist, csrfToken: req.csrfToken()});
			}
			else {
				res.status(404);
				res.render('errors/404');
			}
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* PUT updated wishlist. */
router.put('/:occasionId([a-zA-Z0-9]{24})/wishlists/:wishlistId([a-zA-Z0-9]{24})', urlencodedParser, function (req, res) {
	if (!req.body || (!req.body.name && !req.body.occurrence)) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the wishlist.'});
	}

	var service = new WishlistsService();
	service.update(req.params.wishlistId, req.body.name, req.body.occurrence).then(
		function (success) {
			return res.send({message: 'Successfully updated the wishlist.'});
		}
	).catch(
		function (error) {
			res.status(500);
			res.send({message: error});
		}
	);
});

/* GET new wishlist. */
router.get('/:occasionId(a-zA-Z0-9]{24})/wishlists/new', function (req, res, next) {
	res.render('templates/shell', {partials: {page: '../occasions/new'}, title: 'New Wishlist - Wishlists', csrfToken: req.csrfToken()})
})

/* POST new wishlist */
router.post('/:occasionId(a-zA-Z0-9]{24})/wishlists/new', urlencodedParser, function(req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required name of the wishlist.'});
	}

  	var service = new WishlistsService();
	service.create(req.body.name, req.body.occurrence).then(
		function (success) {
			res.redirect('/occasions');
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* DELETE wishlist.*/
router.delete('/:occasionId([a-zA-Z0-9]{24})/wishlists/:wishlistId([a-zA-Z0-9]{24})', function (req, res) {
	if (!req.params || !req.params.wishlistId) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required wishlistId.'});
	}

	var service = new WishlistsService();
	service.delete(req.params.wishlistId).then(
		function (success) {
			res.sendStatus(200);
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

module.exports = router;