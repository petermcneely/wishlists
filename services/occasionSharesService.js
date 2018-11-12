'use strict'

const dal = require('../DAL/occasions');

module.exports = class OccasionSharesService {

	create(occasionSlug, emails) {
		return dal.createOccasionShares(occasionSlug, emails);
	}

	get(occasionSlug, email) {
		return dal.getOccasionShare(occasionSlug, email);
	}

	delete(occasionSlug, email) {
		return deleteOccasionShare(occasionSlug, email);
	}
}