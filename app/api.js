//Require our Models

// var Report = require('./models/report');

var express  = require('express');
var mongoose = require('mongoose');
var apiRoutes = express.Router();



apiRoutes.get('/', function (req,res) {
    res.json({Message: 'Welcome To Reported API. More to come'});
});

// route middleware to ensure User is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

module.exports = apiRoutes;