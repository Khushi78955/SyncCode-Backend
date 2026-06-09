const { z } = require("zod");

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})


const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/),
    newPassword: z.string().min(6)
})

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
})

const logoutSchema = z.object({
    refreshToken: z.string().min(1)
})

const oauthSchema = z.object({
    token: z.string().min(1)
})
module.exports = {signupSchema, loginSchema, resetPasswordSchema, refreshTokenSchema, logoutSchema, oauthSchema}