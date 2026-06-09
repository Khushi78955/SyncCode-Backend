const {sendOtpService, verifyOtpService  } = require("../services/otp.service")

const sendOtp = async function(req, res, next){
    try{
        const result = await sendOtpService(req.body.email);
        res.json(result)
    } catch(err){
        next(err)
    }
}

const verifyOtp = async function(req, res, next){
    try{
        const result = await verifyOtpService(req.body.email, req.body.otp);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}

module.exports = {sendOtp, verifyOtp}