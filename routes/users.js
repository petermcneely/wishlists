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
    service.createUser(req.body.email, req.body.password, req.body.retypePassword).then(
      function (success) {
        res.redirect('sign-in');
      },
      function (error) {
        console.log(error);
        res.redirect('sign-up');
      }
    );
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
  passport.authenticate('local', { failureRedirect: 'sign-in' }),
  function(req, res) {
    res.redirect('/');
  });
  
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

module.exports = router;
