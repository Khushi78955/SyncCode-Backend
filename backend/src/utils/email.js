const nodemailer =  require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendEmail = async function(to, subject, text){
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    })
}

const buildOtpEmail = function(otp){
    return `

=================================

           SYNCCODE

=================================

Your OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request this OTP,

please ignore this email.

- SyncCode Team

`;
}



module.exports = {sendEmail, buildOtpEmail}