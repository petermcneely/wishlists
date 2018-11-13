'use strict'

const TableCall = require('./tableCall');
const occasions = new TableCall("occasions");
const users = new TableCall("users");

module.exports = function () {
	return Promise.all([
		occasions.call(collection => {
			return Promise.all([
				collection.createIndex({slug: 1}, {unique: true}),
				collection.createIndex({slug: 1, "wishlists.slug": 1}),
				collection.createIndex({slug: 1, "wishlists.slug": 1, "wishlists.item.slug": 1})
			]);	
		}),
		users.call(collection => {
			return collection.createIndex({email: 1}, {unique: true})
		})
	]);
}