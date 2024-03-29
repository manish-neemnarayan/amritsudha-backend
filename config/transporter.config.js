const nodemailer = require("nodemailer");
const config = require("./index");

const transporter = nodemailer.createTransport({
        host: config.SMTP_MAIL_HOST,
        port: config.SMTP_MAIL_PORT,
        secure: false, // use SSL
        auth: {
                user: config.SMTP_MAIL_USERNAME,
                pass: config.SMTP_MAIL_PASSWORD
        }
 })
        
module.exports = transporter;
        