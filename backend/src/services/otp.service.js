const prisma = require("../config/db")
const bcrypt = require("bcrypt");
const {sendEmail, buildOtpEmail} = require("../utils/email")

const sendOtpService = async function(email){
    if(!email){
        throw new Error("Email is required");
    }
    const otp = Math.floor(100000+Math.random()*900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes()+5);
    await prisma.otp.upsert({
        where: {
            email
        },
        update: {
            otp: hashedOtp,
            expiresAt
        },
        create: {
            email,
            otp: hashedOtp,
            expiresAt
        }
    })
    const emailBody = buildOtpEmail(otp);
    await sendEmail(
        email,
        "Your SyncCode OTP",
        emailBody
    )
    return {
        message: "OTP sent successfully"
    }
}


const verifyOtpService = async function(email, otp){
    if(!email){
        throw new Error("Email is required");
    }
    if(!otp){
        throw new Error("Otp is required");
    }

    const otpRecord = await prisma.otp.findUnique({
        where: {
            email
        }
    })
    if(!otpRecord){
        throw new Error("OTP not found")
    }
    if(otpRecord.expiresAt < new Date()){
        throw new Error("OTP expired")
    }

    const isOtpCorrect = await bcrypt.compare(otp, otpRecord.otp);
    if(!isOtpCorrect){
        throw new Error("Invalid Otp")
    }

    await prisma.otp.delete({
        where: {
            email
        }
    })

    return {
        message: "OTP verified successfully"
    }
}

module.exports = {sendOtpService, verifyOtpService}