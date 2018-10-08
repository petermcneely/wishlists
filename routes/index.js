'use strict'

var express = require('express');
var router = express.Router();
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

/* GET create */
router.get('/create', function(req, res, next) {
	var date = new Date();
  	var controller = new OccasionsController();
	controller.create('Occasion', date).then(
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
