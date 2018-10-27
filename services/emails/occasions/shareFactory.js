'use strict'

module.exports = {
	getBody: function (sender, url) {
		return "<p>" + sender + " has shared an occasion with you!</p>\
		<p>Click <a href='" + url + "'>here</a> to see the occasion.</p>\
		<br/><br/><p>If the link doesn't work, copy and paste the following into a browser: " + url + ".</p>";
	},

	getSubjectLine: function () {
		return "Someone has shared an occasion with you!";
	}
}