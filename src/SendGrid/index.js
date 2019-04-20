require("dotenv").config();
const mail = require('@sendgrid/mail');

mail.setApiKey(process.env.sendgrid_api);
let comb = ""
for(var i = 0; i < 10; i++) comb += String(i);
for(var i = 65; i < 91; i++) comb += String.fromCharCode(i);

module.exports = {
    send: (to, subject, text, html) => new Promise((resolve, reject) => {
        if(!!!process.env.sendgrid_api) return reject("No SendGrid API Key Found.");
        mail.send({
            to: to,
            from: `G18COMP3335@G18COMP3335.com`,
            subject: subject,
            text: text,
            html: html || text
        }).then(r => resolve(r[0].toJSON()))
        .catch(e => reject(e));
    }),

    generateCode: () => {
        this.result = "";
        for (var i = 0; i < 6; i++) this.result += comb.charAt(Math.floor(Math.random() * comb.length))
        return this.result;
    }
}