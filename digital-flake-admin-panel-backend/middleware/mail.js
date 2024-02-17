const nodemailer = require("nodemailer");

async function sendMail(to, cc, mail, subject) {
    let transporter = await nodemailer.createTransport({

        service:"gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Admin Portal " <digitalFlake@gmail.com>', 
        to: to, 
        cc: cc, 
        subject: subject, 
        text: "", 
        html: mail, 
    });

    return info;
}

module.exports = { method: sendMail };