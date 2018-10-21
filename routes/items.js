'use strict'

var express = require('express');
var router = express.Router();
var urlencodedParser = express.urlencoded({extended: true});
var ItemsService = require('../services/itemsService');

/* GET wishlist item. */
router.get('/:itemId([a-zA-Z0-9]{24})', function (req, res) {

	var service = new ItemsService();
	service.get(req.params.itemId).then(
		function (item) {
			if (item) {
				res.render('templates/shell', {partials: {page: '../items/details'}, title: item.name + ' - Wishlists', csrfToken: req.csrfToken()});
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

/* PUT updated wishlist item. */
router.put('/:itemId([a-zA-Z0-9]{24})', urlencodedParser, function (req, res) {
	if (!req.body || (!req.body.name || !req.body.comments || !req.body.link)) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name, comments, or link must be sent to update the wishlist item.'});
	}

	var service = new ItemsService();
	service.update(req.params.itemId, req.body.name, req.body.comments, req.body.link).then(
		function (success) {
			return res.send({message: 'Successfully updated the wishlist item.'});
		}
	).catch(
		function (error) {
			res.status(500);
			res.send({message: error});
		}
	);
});

/* GET new wishlist item. */
router.get('/new', function (req, res, next) {
	res.render('templates/shell', {partials: {page: '../items/new'}, title: 'New Wishlist Item - Wishlists', wishlistId: req.wishlistId, csrfToken: req.csrfToken()})
})

/* POST new wishlist item */
router.post('/new', urlencodedParser, function(req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required name of the wishlist item.'});
	}

  	var service = new ItemsService();
	service.create(req.body.name, req.body.comments, req.body.link, req.wishlistId).then(
		function (success) {
			res.redirect('/occasions/' + req.occasionId + '/wishlists/' + req.wishlistId);
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* DELETE wishlist item.*/
router.delete('/:itemId([a-zA-Z0-9]{24})', function (req, res) {

	var service = new ItemsService();
	service.delete(req.params.itemId).then(
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