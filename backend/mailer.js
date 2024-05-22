const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "isaacnievarez@gmail.com",
    pass: "gzvt acij uqwa cfgm",
  },
});

/**
 * Send mail with defined transport object and mail options
 * @param {Object} mailOptions - Mail options (from, to, subject, text, html)
 * @param {Function} callback - Callback function to handle response
 */
const SEND_MAIL = (mailOptions, callback) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      callback(error);
    } else {
      console.log("Email sent: ", info.response);
      callback(null, info);
    }
  });
};

module.exports = SEND_MAIL;