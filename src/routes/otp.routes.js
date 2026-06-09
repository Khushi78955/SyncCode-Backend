const express = require("express");
const router = express.Router();
const {apiLimiter} = require("../middleware/rateLimit.middleware")

const {sendOtp, verifyOtp} = require("../controllers/otp.controller")

const validate = require("../middleware/validate.middleware")
const {sendOtpSchema, verifyOtpSchema} = require("../validators/otp.validator");

router.post("/send", apiLimiter, validate(sendOtpSchema), sendOtp);
router.post("/verify", validate(verifyOtpSchema), verifyOtp)

module.exports = router;