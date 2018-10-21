'use strict'

var express = require('express');
var router = express.Router();
var wishlists = require('./wishlists');
var urlencodedParser = express.urlencoded({extended: true});
var OccasionsService = require('../services/occasionsService');

/* GET home page. */
router.get('/', function(req, res, next) {
  	var service = new OccasionsService();
  	service.index().then(
  		function (success) {
  			res.render('templates/shell', { partials: {page: '../occasions/index'}, title: 'Occasions - Wishlists', breadcrumbs: req.breadcrumbs, occasions: success});
  		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* GET occasion. */
router.get('/:occasionId([a-zA-Z0-9]{24})', function (req, res) {
	req.breadcrumbs[1].label = 'Details';
	var service = new OccasionsService();
	service.get(req.params.occasionId).then(
		function (occasion) {
			if (occasion) {
				res.render('templates/shell', {partials: {page: '../occasions/details', wishlists: '../wishlists/index'}, breadcrumbs: req.breadcrumbs, title: occasion.name + ' - Wishlists', occasion: occasion, csrfToken: req.csrfToken()});
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

/* PUT updated occasion. */
router.put('/:occasionId([a-zA-Z0-9]{24})', urlencodedParser, function (req, res) {
	if (!req.body || (!req.body.name && !req.body.occurrence)) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the occasion.'});
	}

	var service = new OccasionsService();
	service.update(req.params.occasionId, req.body.name, req.body.occurrence).then(
		function (success) {
			return res.send({message: 'Successfully updated the occasion.'});
		}
	).catch(
		function (error) {
			res.status(500);
			res.send({message: error});
		}
	);
});

/* GET new occasion. */
router.get('/new', function (req, res, next) {
	res.render('templates/shell', {partials: {page: '../occasions/new'}, title: 'New Occasion - Wishlists', breadcrumbs: req.breadcrumbs, csrfToken: req.csrfToken()})
})

/* POST new occasion */
router.post('/new', urlencodedParser, function(req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required name of the occasion.'});
	}

  	var service = new OccasionsService();
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

/* DELETE occasion.*/
router.delete('/:occasionId([a-zA-Z0-9]{24})', function (req, res) {

	var service = new OccasionsService();
	service.delete(req.params.occasionId).then(
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

router.use('/:occasionId([a-zA-Z0-9]{24})/wishlists', function (req, res, next) {
	req.occasionId = req.params.occasionId;
	req.breadcrumbs[1].label = 'Details';
	req.breadcrumbs.splice(2, 1);
	next()
}, wishlists);

module.exports = router;