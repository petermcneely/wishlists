'use strict'

module.exports = {
	getBody: function (password, url) {
		return "<p>Ah bummer...you forgot your password?</p>\
		<p>No worries! Here's a new one: " + password + "</p>\
		<p>Head on over to " + url + " and sign in.</p>\
		<p>Please be sure to change your password as this one will expire in 24 hours.</p>";
	},

	getSubjectLine: function () {
		return "We've generated a new password for you!";
	}
}