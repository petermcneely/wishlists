'use strict'

var config = require('../config/development');
const MongoClient = require('mongodb').MongoClient;

module.exports = function () {
	let url = config.mongoHost + ':' + config.mongoPort;
	return MongoClient.connect(url, { useNewUrlParser: true}).catch(function (error) {
		console.log("Can't connect to the mongo database hosted at " + url );
		console.log(error);
	});
}