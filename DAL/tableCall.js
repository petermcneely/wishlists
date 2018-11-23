'use strict'

const collection = require('./collection');

module.exports = class TableCall {
	constructor(tableName) {
		this.tableName = tableName;
	}

	call(cb) {
		this.client = null;
		return collection(this.tableName).then(obj => {
			this.client = obj.client;
			return cb(obj.collection).then(result => {
				if (this.client) {
					this.client.close();
				}
				else {
					console.log("No client?");
				}
				return result;
			}).catch(e => {
				console.log(e);
				if (this.client) this.client.close();
				return Promise.reject(e);
			});
		});
	}
}