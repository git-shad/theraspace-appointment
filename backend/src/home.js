const SEND_MAIL = require('../mailer');

const home = (app) => {
    app.post('/home',async (req,res)=>{
        const {subject,email,message} = req.body; 
        console.log(req.body);
        const mailOptions = {
            from: 'isaacnievarez@gmail.com',
            to: "isaacnievarez@gmail.com",
            subject: subject,
            text: message,
            html: `
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="20" style="background-color:#f1f1f1;">
                            <tr>
                                <td>
                                    <h2 style="color:#333333;">New Message from ${email}</h2>
                                    <p style="color:#333333;">${message}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `
        };

        await SEND_MAIL(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
            } else {
                console.log("Email sent successfully");
                console.log("MESSAGE ID: ", info.messageId);
            }
        });
    })
}

module.exports = {home}