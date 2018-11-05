'use strict'

const dal = require('../DAL/occasions');

module.exports = class OccasionSharesService {

	create(occasionId, emails) {
		return dal.createOccasionShares(occasionId, emails);
	}

	get(occasionId, email) {
		return dal.getOccasionShare(occasionId, email);
	}

	delete(occasionId, email) {
		return deleteOccasionShare(occasionId, email);
	}
}