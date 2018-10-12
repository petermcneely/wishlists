'use strict'

var express = require('express');
var router = express.Router();
var urlencodedParser = express.urlencoded({extended: false});
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
			res.send(error);
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
		return res.sendStatus(400);
	}

  	var service = new OccasionsService();
	service.create(req.body.name, req.body.occurrence).then(
		function (success) {
			res.redirect('/occasions');
		}
	).catch(
		function (error) {
			res.send(error);
		}
	);
});

/* DELETE occasion.*/
router.delete('/delete/:id', function (req, res) {
	if (!req.params || !req.params.id) {
		return res.sendStatus(400);
	}

	var service = new OccasionsService();
	service.delete(req.params.id).then(
		function (success) {
			res.redirect('/occasions');
		}
	).catch(
		function (error) {
			res.send(error);
		}
	);
})

module.exports = router;