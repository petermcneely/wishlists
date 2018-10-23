'use strict'

const connect = require('./utils/mongoUtils');

module.exports = class OccasionSharesService {
	constructor() {
		this.tableName = 'occasionShares';
	}

	create(occasionId, userId) {
		return this.get(occasionId, userId).then(function (doc) {
			if (!doc) {
				connect().then(function (client) {
					const db = client.db('wishlists');
					db.collection(this.tableName).insert({occasionId: occasionId, userId: userId}).then(function () {
						console.log("Successully created the share.");
						client.close();
					}.bind(this)).catch(err => console.log(err));
				}.bind(this)).catch(err => console.log(err));
			}
			else {
				console.log("That share already exists!");
			}
		}.bind(this)).catch(err => console.log(err));
	}

	get(occasionId, userId) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).findOne({occasionId: occasionId, userId: userId}).then(function (result) {
				client.close();
				return result;
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}

	delete(occasionId, userId) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).deleteOne({occasionId: occasionId, userId: userId}).then(function () {
				console.log("Successully deleted the share.");
				client.close();
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}
}