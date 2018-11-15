'use strict'

const MongoClient = require('mongodb').MongoClient;

module.exports = function (tableName) {
	let url = process.env.MONGO_URL;
	return MongoClient.connect(url, { useNewUrlParser: true}).then(function (client) {
		const db = client.db('wishlists');
		return {
			collection: db.collection(tableName),
			client: client
		};
	}.bind(this)).catch(function (error) {
		console.log("Can't connect to the mongo database hosted at " + url );
		console.log(error);
	});
}