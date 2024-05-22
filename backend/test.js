const SEND_MAIL = require('./mailer');

const message = "theraspace message";
const mailOptions = {
  from: 'isaacnievarez@gmail.com',
  to: "isaacnievarez@gmail.com",
  subject: "Theraspace report",
  text: message,
  html: `<p>${message}</p>`
};

SEND_MAIL(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent successfully");
    console.log("MESSAGE ID: ", info.messageId);
  }
});