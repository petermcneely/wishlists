var express = require('express');
var router = express.Router();
var controller = require('../controllers/homeController');

/* GET home page. */
router.get('/', function(req, res, next) {s
  	res.render('index', { title: 'Express' });
});

/* GET test with MongoDB */
router.get('/test', function(req, res, next) {
	controller.test();
	res.send('in test');
});

module.exports = router;
