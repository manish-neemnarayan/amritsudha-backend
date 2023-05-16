const transporter = require("../config/transporter.config")
const config = require("../config/index");

const mailHelper = async (options) => {
    const message = {
        from: config.SMTP_MAIL_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.text,
      };
      
    await transporter.sendMail(message);
    
}

module.exports = mailHelper;