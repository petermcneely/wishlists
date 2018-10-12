'use strict'

var express = require('express');
var router = express.Router();
var OccasionsService = require('../services/occasionsService');

/* GET home page. */
router.get('/', function(req, res, next) {
  	var controller = new OccasionsService();
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

module.exports = router;
