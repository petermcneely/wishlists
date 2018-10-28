'use strict'

const connect = require('../utils/mongoUtils');
var mongodb = require('mongodb');

module.exports = class OccasionSharesService {
	constructor() {
		this.tableName = 'occasionShares';
	}

	create(occasionId, emails) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			var promises = [];
			emails.forEach(function (email) {
				var occasionShare = {
					occasionId: occasionId,
					email: email
				};

				var result = db.collection(this.tableName).update(occasionShare, occasionShare, {upsert: true});
				if (result.writeConcernError) {
					promises.push(new Promise((res, rej) => rej(result.writeConcernError.errmsg)));
				}
				else if (result.writeError) {
					promises.push(new Promise((res, rej) => rej(result.writeError.errmsg)));
				}
				else {
					promises.push(new Promise((res, rej) => res("Successfully upserted the document.")));
				}
			}.bind(this));
			return promises;
		}.bind(this)).catch(e => console.log(e));
	}

	get(occasionId, email) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			return db.collection(this.tableName).findOne({occasionId: occasionId, email: email}).then(function (result) {
				client.close();
				return result;
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}

	delete(occasionId, email) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).deleteOne({occasionId: occasionId, email: email}).then(function () {
				console.log("Successully deleted the share.");
				client.close();
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}
}