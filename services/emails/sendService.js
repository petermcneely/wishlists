'use strict'
var helper = require('sendgrid').mail;

var sendEmail = function (content) {
	if (content && content.to && content.to.constructor === Array) {
		var promises = [];
		content.to.forEach(function (e) {
			let newContent = {
				to: e,
				from: content.from,
				subject: content.subject,
				html: content.html
			};
			promises.push(this.sendEmail(newContent));
		}.bind(this));
		return Promise.all(promises);
	}
	else {
		let toEmail = new helper.Email(content.to);
		let fromEmail = new helper.Email(content.from);
		let body = new helper.Content('text/html', content.html);
		let mail = new helper.Mail(fromEmail, content.subject, toEmail, body);

		var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
		var request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: mail.toJSON()
		});
		 
		return sg.API(request).then(function (response) {
			console.log(response.statusCode);
	  		console.log(response.body);
	  		console.log(response.headers);
		});
	}
}

module.exports = {
	sendEmail: sendEmail
}
