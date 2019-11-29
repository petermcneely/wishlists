'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('templates/shell', {
    partials: {page: '../home/index'},
    title: process.env.TITLE,
    user: req.user,
  });
});

module.exports = router;
