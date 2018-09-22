var config = require('../config/development');
var MongoClient = require('mongodb').MongoClient;

module.exports = {
	test: function () {
		MongoClient.connect(config.mongoHost + ':' + config.mongoPort, { useNewUrlParser: true}, function (err, client) {
			if (err)
				throw err;

			const db = client.db('wishlists');
			let users = db.collection('users').find().toArray(function (err, docs) {
				if (err)
					throw err;

				console.log(docs);
			});

			client.close();
		});
	}
}