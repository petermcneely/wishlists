'use strict'

var express = require('express');
var router = express.Router();
var wishlists = require('./wishlists');
var urlencodedParser = express.urlencoded({extended: true});
var OccasionsService = require('../services/occasionsService');
var ensure = require('connect-ensure-login');

/* GET home page. */
router.get('/', function(req, res, next) {
  	var service = new OccasionsService();
  	service.index().then(
  		function (success) {
  			res.render('templates/shell', { 
  				partials: {page: '../occasions/index'}, 
  				title: 'Occasions - Wishlists', 
  				breadcrumbs: req.breadcrumbs, 
  				user: req.user,
  				occasions: success
  			});
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
	service.get(req.user ? req.user._id : null, req.params.occasionId).then(
		function (occasion) {
			if (occasion) {
				res.render('templates/shell', {
					partials: {page: '../occasions/details', 
					wishlists: '../wishlists/index'}, 
					breadcrumbs: req.breadcrumbs, 
					user: req.user,
					title: occasion.name + ' - Wishlists', 
					occasion: occasion, 
					csrfToken: req.csrfToken()
				});
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
router.put('/:occasionId([a-zA-Z0-9]{24})', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), urlencodedParser, function (req, res) {
	if (!req.body || (!req.body.name && !req.body.occurrence)) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the occasion.'});
	}

	var service = new OccasionsService();
	service.update(req.user._id, req.params.occasionId, req.body.name, req.body.occurrence).then(
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

router.all('/new', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}));

/* GET new occasion. */
router.get('/new', function (req, res, next) {
	res.render('templates/shell', {
		partials: {page: '../occasions/new'}, 
		title: 'New Occasion - Wishlists', 
		breadcrumbs: req.breadcrumbs, 
		user: req.user,
		csrfToken: req.csrfToken()})
})

/* POST new occasion */
router.post('/new', urlencodedParser, function(req, res) {
	if (!req.body || !req.body.name) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required name of the occasion.'});
	}

  	var service = new OccasionsService();
	service.create(req.user._id, req.body.name, req.body.occurrence).then(
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
router.delete('/:occasionId([a-zA-Z0-9]{24})', ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), function (req, res) {

	var service = new OccasionsService();
	service.delete(req.user._id, req.params.occasionId).then(
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

/* POST emails to send.*/
// Responsible for emailing share link to emails.
// Responsible for saving the records of occasion shares.
router.post('/:occasionId([a-zA-Z0-9]{24})/share', urlencodedParser, ensure.ensureLoggedIn({redirectTo: '/users/sign-in'}), function (req, res) {

	var sendService = require('../services/emails/sendService');
	var shareFactory = require('../services/emails/occasions/shareFactory');
	var UsersService = require('../services/UsersService');
	
	var usersService = new UsersService();

	usersService.findById(req.user._id).then(function (user) {
		if (user) {
			sendService.sendEmail({
				from: user.email,
				to: req.body.emails,
				subject: shareFactory.getSubjectLine(),
				html: shareFactory.getBody(user.email, req.protocol + '://' + req.get('Host') + '/occasions/' + req.params.occasionId)
			}).then(function () {
				var OccasionSharesService = require('../services/occasionSharesService');
				var occasionSharesService = new OccasionSharesService();
				occasionSharesService.create(req.params.occasionId, req.body.emails).then(function () {
					res.status(200);
					res.send({message: 'Successfully shared the occasion!'});
				}.bind(this)).catch(function (e) {
					res.status(500);
					res.send({message: 'An internal error occurred but, your emails were sent!'});
					console.log(e);
				});
			}.bind(this)).catch(function (e) {
				res.status(500);
				res.send({message: 'An error occurred while sharing the occasion.'});
				console.log(e);	
			}.bind(this));
		}
		else {
			res.status(500);
			res.send({message: 'Cannot find the user trying to share the occasion.'});
		}
	}.bind(this));
});

router.use('/:occasionId([a-zA-Z0-9]{24})/wishlists', function (req, res, next) {
	req.occasionId = req.params.occasionId;
	if (req.breadcrumbs) {
		req.breadcrumbs[1].label = 'Details';
		req.breadcrumbs.splice(2, 1);
	}
	next()
}, wishlists);

module.exports = router;