'use strict'

const connect = require('../utils/mongoUtils');

module.exports = class OccasionSharesService {
	constructor() {
		this.tableName = 'occasionShares';
	}

	create(occasionId, userId, emails) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			var promises = [];
			emails.forEach(function (email) {
				var occasionShare = {
					occasionId: occasionId,
					userId: userId,
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

	get(occasionId, userId, email) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).findOne({occasionId: occasionId, userId: userId, email: email}).then(function (result) {
				client.close();
				return result;
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}

	delete(occasionId, userId, email) {
		return connect().then(function (client) {
			const db = client.db('wishlists');
			db.collection(this.tableName).deleteOne({occasionId: occasionId, userId: userId, email: email}).then(function () {
				console.log("Successully deleted the share.");
				client.close();
			}.bind(this)).catch(err => console.log(err));
		}.bind(this)).catch(err => console.log(err));
	}
}