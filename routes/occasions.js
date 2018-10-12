'use strict'

var express = require('express');
var router = express.Router();
var urlencodedParser = express.urlencoded({extended: false});
var OccasionsController = require('../controllers/occasionsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  	var controller = new OccasionsController();
  	controller.index().then(
  		function (success) {
  			res.send(success);
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

  	var controller = new OccasionsController();
	controller.create(req.body.name, req.body.occurrence).then(
		function (success) {
			res.send(success);
		}
	).catch(
		function (error) {
			res.send(error);
		}
	);
});

module.exports = router;