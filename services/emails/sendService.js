'use strict';
const helper = require('sendgrid').mail;

const sendEmail = function(content) {
  if (content && content.to && content.to.constructor === Array) {
    const promises = [];
    content.to.forEach(function(e) {
      const newContent = {
        to: e,
        from: content.from || process.env.SENDGRID_FROM,
        subject: content.subject,
        html: content.html,
      };
      promises.push(this.sendEmail(newContent));
    // eslint-disable-next-line no-invalid-this
    }.bind(this));
    return Promise.all(promises);
  } else {
    const toEmail = new helper.Email(content.to);
    const fromEmail = new helper.Email(
        content.from || process.env.SENDGRID_FROM);
    const body = new helper.Content('text/html', content.html);
    const mail = new helper.Mail(fromEmail, content.subject, toEmail, body);

    const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    // eslint-disable-next-line new-cap
    return sg.API(request);
  }
};

module.exports = {
  sendEmail: sendEmail,
};
