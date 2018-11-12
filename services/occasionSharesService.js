'use strict'

const dal = require('../DAL/occasions');

module.exports = class OccasionSharesService {

	create(id, emails) {
		return dal.createOccasionShares(id, emails);
	}

	get(id, email) {
		return dal.getOccasionShare(id, email);
	}

	delete(id, email) {
		return deleteOccasionShare(id, email);
	}
}