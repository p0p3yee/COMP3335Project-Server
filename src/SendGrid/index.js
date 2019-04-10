require("dotenv").config();
const mail = require('@sendgrid/mail');

mail.setApiKey(process.env.sendgrid_api);

module.exports = (to, subject, text, html) => new Promise((resolve, reject) => {
    if(!!!process.env.sendgrid_api) return reject("No SendGrid API Key Found.");
    mail.send({
        to: to,
        from: `Group18@COMP3335.com`,
        subject: subject,
        text: text,
        html: html || text
    }).then(r => resolve(r[0].toJSON()))
    .catch(e => reject(e));
})