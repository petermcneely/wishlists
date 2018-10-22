'use strict'

var express = require('express');
var router = express.Router();
var items = require('./items');
var urlencodedParser = express.urlencoded({extended: true});
var WishlistsService = require('../services/wishlistsService');

/* GET wishlist. */
router.get('/:wishlistId([a-zA-Z0-9]{24})', function (req, res) {
	req.breadcrumbs[2].label = 'Wishlist';
	var service = new WishlistsService();
	service.get(req.params.wishlistId).then(
		function (wishlist) {
			if (wishlist) {
				res.render('templates/shell', {
					partials: {page: '../wishlists/details', 
					items: '../items/index'}, 
					breadcrumbs: req.breadcrumbs, 
					user: req.user,
					title: wishlist.name + ' - Wishlists', 
					wishlist: wishlist, 
					csrfToken: req.csrfToken()});
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
router.put('/:wishlistId([a-zA-Z0-9]{24})', urlencodedParser, function (req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the wishlist.'});
	}

	var service = new WishlistsService();
	service.update(req.params.wishlistId, req.body.name).then(
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
router.get('/new', function (req, res, next) {
	res.render('templates/shell', {
		partials: {page: '../wishlists/new'}, 
		breadcrumbs: req.breadcrumbs, 
		user: req.user,
		title: 'New Wishlist - Wishlists', 
		occasionId: req.occasionId, 
		csrfToken: req.csrfToken()
	});
})

/* POST new wishlist */
router.post('/new', urlencodedParser, function(req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required name of the wishlist.'});
	}

  	var service = new WishlistsService();
	service.create(req.body.name, req.occasionId).then(
		function (success) {
			res.redirect('/occasions/' + req.occasionId);
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* DELETE wishlist.*/
router.delete('/:wishlistId([a-zA-Z0-9]{24})', function (req, res) {

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

router.use('/:wishlistId([a-zA-Z0-9]{24})/items', function (req, res, next) {
	req.wishlistId = req.params.wishlistId;
	if (req.breadcrumbs) {
		req.breadcrumbs[2].label = 'Wishlist';
		req.breadcrumbs.splice(3, 1);
	}
	next()
}, items);

module.exports = router;