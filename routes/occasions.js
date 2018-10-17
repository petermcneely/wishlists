'use strict'

var express = require('express');
var router = express.Router();
var urlencodedParser = express.urlencoded({extended: true});
var OccasionsService = require('../services/occasionsService');

/* GET home page. */
router.get('/', function(req, res, next) {
  	var service = new OccasionsService();
  	service.index().then(
  		function (success) {
  			res.render('occasions/index', {occasions: success});
  		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
});

/* GET occasion. */
router.get('/:id([a-zA-Z0-9]{24})', function (req, res) {
	if (!req.params || !req.params.id) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required id parameter.'});
	}
	var service = new OccasionsService();
	service.get(req.params.id).then(
		function (occasion) {
			if (occasion) {
				res.render('occasions/details', {occasion: occasion, csrfToken: req.csrfToken()});
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
router.put('/:id([a-zA-Z0-9]{24})', urlencodedParser, function (req, res) {
	if (!req.body || (!req.body.name && !req.body.occurrence)) {
		res.status(400);
		res.render('errors/400', {message: 'An updated name or occurrence date must be sent to update the occasion.'});
	}

	var service = new OccasionsService();
	service.update(req.params.id, req.body.name, req.body.occurrence).then(
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
	res.render('occasions/new', {csrfToken: req.csrfToken()})
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
router.delete('/delete/:id([a-zA-Z0-9]{24})', function (req, res) {
	if (!req.params || !req.params.id) {
		res.status(400);
		res.render('errors/400', {message: 'Missing the required id.'});
	}

	var service = new OccasionsService();
	service.delete(req.params.id).then(
		function (success) {
			res.redirect('/occasions');
		}
	).catch(
		function (error) {
			res.status(500);
			res.render('errors/500', {error: error});
		}
	);
})

module.exports = router;