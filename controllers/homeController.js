var utils = require('../utils/mongoUtils');

module.exports = {
	test: function () {
		utils(function (db) {
			let users = db.collection('users').find().toArray(function (err, docs) {
				if (err)
					throw err;

				console.log(docs);
			});
		});
	}
}