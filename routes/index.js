'use strict'

var express = require('express');
var router = express.Router();
var OccasionsService = require('../services/occasionsService');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('templates/shell', {
  		partials: {page: '../home/index'},
        title: process.env.TITLE,
  		user: req.user
  	});
});

module.exports = router;
