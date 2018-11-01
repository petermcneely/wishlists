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
        if (response && response.message) {
          res.status(500).json({message: response.message});
        }
        else {
          res.sendStatus(200);
        }
      }).catch(function (error) {
        console.log(error);
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
  
router.post('/sign-in', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {return res.status(401).send("Invalid username or password.");}
    req.logIn(user, function (err) {
      if (err) {return next(err);}
      return res.sendStatus(200);
    })
  })(req, res, next);
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
    	user: req.user,
      csrfToken: req.csrfToken()
    });
  });

router.get('/forgot-password', (req, res) => {
  res.render('templates/shell', {partials: {page: '../users/forgotPassword'}, csrfToken: req.csrfToken()});
});

router.post('/forgot-password', function (req, res) {
  var service = new UserService();
  service.overwritePassword(req.body.email).then(function (password) {
    var sendService = require('../services/emails/sendService');
    var forgotPasswordFactory = require('../services/emails/users/forgotPasswordFactory');
    sendService.sendEmail({
      from: 'pete.mcneely@gmail.com',
      to: req.body.email,
      subject: forgotPasswordFactory.getSubjectLine(),
      html: forgotPasswordFactory.getBody(password, req.protocol + '://' + req.get('Host') + '/users/sign-in')
    }).then(() => {
      res.status(200).send({message: 'Successfully sent you and email!'});
    }).catch((e) => {
      console.log(e);
      res.status(500).send({message: 'An internal error has occurred.'});
    });
  }.bind(this)).catch(function (e) {
    res.render('errors/500');
  });
});

router.post('/change-password', ensure.ensureLoggedIn({redirectTo: 'sign-in'}), function (req, res) {
  var service = new UserService();
  service.changePassword(req.body.currentPassword, req.body.newPassword, req.body.retypePassword, req.user ? req.user._id : null).then(function (response) {
    if (response && response.message) {
      res.status(500).send({message: message});
    }
    else
    {
      res.status(200).send({message: "Successfully changed your password!"})
    }
  }.bind(this)).catch(function (e) {
    console.log(e);
    res.status(500).send({message: 'An internal error has occurred.'});
  }.bind(this));
});

module.exports = router;