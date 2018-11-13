'use strict'

var express = require('express');
var router = express.Router();
var items = require('./items');
var urlencodedParser = express.urlencoded({extended: true});
var ensure = require('connect-ensure-login');
var WishlistsService = require('../services/wishlistsService');

router.all('/new', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}));

/* GET new wishlist. */
router.get('/new', function (req, res, next) {
	res.render('templates/shell', {
		partials: {page: '../wishlists/new'}, 
		breadcrumbs: req.breadcrumbs, 
        user: req.user,
        subTitle: 'New Wishlist - ',
        title: process.env.TITLE, 
		occasionSlug: req.occasionSlug, 
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
	service.create(req.user._id, req.occasionSlug, req.body.name).then(
		function (success) {
			res.redirect('/occasions/' + req.occasionSlug);
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* GET wishlist. */
router.get('/:wishlistSlug', function (req, res) {
	req.breadcrumbs[2].label = 'Wishlist';
	var service = new WishlistsService();
	service.get(req.user ? req.user._id : null, req.occasionSlug, req.params.wishlistSlug).then(
		function (wishlist) {
			if (wishlist) {
				res.render('templates/shell', {
					partials: {page: '../wishlists/details', 
					items: '../items/index'}, 
					breadcrumbs: req.breadcrumbs, 
                    user: req.user,
                    subTitle: wishlist.name + ' - ',
                    title: process.env.TITLE, 
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
router.put('/:wishlistSlug', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), urlencodedParser, function (req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the wishlist.'});
	}

	var service = new WishlistsService();
	service.update(req.user._id, req.occasionSlug, req.params.wishlistSlug, req.body.name).then(
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

/* DELETE wishlist.*/
router.delete('/:wishlistSlug', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), function (req, res) {

	var service = new WishlistsService();
	service.delete(req.user._id, req.occasionSlug, req.params.wishlistSlug).then(
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

router.use('/:wishlistSlug/items', function (req, res, next) {
	req.wishlistSlug = req.params.wishlistSlug;
	if (req.breadcrumbs) {
		req.breadcrumbs[2].label = 'Wishlist';
		req.breadcrumbs.splice(3, 1);
	}
	next()
}, items);

module.exports = router;