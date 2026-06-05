const { z } = require("zod");

const sendOtpSchema = z.object({
    email: z.string().email()
})

const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6)
})

module.exports = {sendOtpSchema, verifyOtpSchema}