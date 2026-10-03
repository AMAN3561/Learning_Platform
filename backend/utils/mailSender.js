const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            const transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            const info = await transporter.sendMail({
                from: `"StudyNotion || CodeHelp - by Babbar" <${process.env.MAIL_USER}>`,
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log("Email send successfully");
            console.log("Message ID", info.messageId);

            return info;
    }
    catch(error) {
        console.log("Mail Sender error", error.message);
        throw error;
    }
}
module.exports = mailSender;