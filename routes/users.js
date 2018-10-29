var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserService = require('../services/usersService');
var ensure = require('connect-ensure-login');

router.get('/sign-up',
	function (req, res) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.redirect('profile');
    }
    else {
  		res.render('templates/shell', {
  			partials: {page: '../users/signUp'},
  			user: req.user,
  			csrfToken: req.csrfToken()
  		});
    }
	});

router.post('/sign-up',
	function (req, res) {
		var service = new UserService();
    service.createUser(req.body.email, req.body.password, req.body.retypePassword).then(function (response) {
        if (response.message) {
          res.status(500).json({message: response.message});
        }
        else {
          res.redirect('sign-in');
        }
      }).catch(function (error) {
        res.status(500).json({message: "An internal error has occurred."});
      });
	});

router.get('/sign-in',
  function(req, res) {
    res.render('templates/shell', {
    	partials: {page: '../users/signIn'},
    	user: req.user,
    	csrfToken: req.csrfToken()
    });
  });
  
router.post('/sign-in', 
  passport.authenticate('local', { successRedirect: '/' }));
  
router.get('/sign-out',
  ensure.ensureLoggedIn({redirectTo: 'sign-in'}),
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  ensure.ensureLoggedIn({redirectTo: 'sign-in'}),
  function(req, res){
    res.render('templates/shell', {
    	partials: {page: '../users/profile'},
    	user: req.user
    });
  });

router.get('/forgot-password', (res, req) => {
  res.render('templates/shell', {partials: {page: '../users/forgotPassword'}, csrfToken: req.csrfToken()});
});

router.post('/forgot-password', function (req, res) {
  var service = new UsersService();
  service.overwritePassword(req.body.email).then(function () {

  }.bind(this)).catch(function (error) {
    res.render('errors/500');
  });
});

module.exports = router;
