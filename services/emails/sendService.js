'use strict';
import { default as sendgrid, mail as helper } from 'sendgrid';

const emailContent = async (content) => {
  const toEmail = new helper.Email(content.to);
  const fromEmail = new helper.Email(
      content.from || process.env.SENDGRID_FROM);
  const body = new helper.Content('text/html', content.html);
  const mail = new helper.Mail(fromEmail, content.subject, toEmail, body);

  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  /* eslint-disable new-cap */
  return await sg.API(request);
};

const sendEmail = async (req) => {
  if (req && req.to && req.to.constructor === Array) {
    const promises = [];
    req.to.forEach((e) => {
      const newContent = {
        to: e,
        from: req.from || process.env.SENDGRID_FROM,
        subject: req.subject,
        html: req.html,
      };
      promises.push(emailContent(newContent));
    });
    return await Promise.all(promises);
  } else {
    await emailContent(req);
  }
};

export { sendEmail };
