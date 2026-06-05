const prisma = require("../config/db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");
const { createSession } = require("../utils/session");
const { verifyOtpService } = require("./otp.service")
const { client } = require("../utils/google")

const signupService = async function (userData){
    const {name, email, password} = userData;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existingUser){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    const {accessToken, refreshToken} = await createSession(user.id)

    const {password: _, ...safeUser } = user;

    return {
        message: "Signup successful",
        user: safeUser,
        accessToken, 
        refreshToken
    }
}


const loginService = async function(userData){
    const {email, password} = userData;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new Error("Invalid email or password");
    }

    if(!user.password){
        throw new Error("Please login with Google")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        throw new Error("Invalid email or password")
    }

    const {accessToken, refreshToken} = await createSession(user.id)

    const { password: _, ...safeUser } = user

    return {
        message: "Login successful",
        user: safeUser,
        accessToken,
        refreshToken
    }
}


const getMeService = async function(userId){
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if(!user){
        throw new Error("User not found")
    }
    
    const {password: _, ...safeUser } = user
    return safeUser
}



const refreshTokenService = async function(userData){
    const {refreshToken} = userData;
    if(!refreshToken){
        throw new Error("Refresh token required")
    }

    let decoded;
    try{
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    } catch(err){
        throw new Error("Invalid refresh token")
    }
    

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    })
    if(!storedToken){
        throw new Error("Refresh token not found")
    }
    if(storedToken.revoked){
        throw new Error("Refresh token revoked")
    }
    if(storedToken.expiresAt < new Date()){
        throw new Error("Refresh token expired")
    }

    const accessToken = generateAccessToken(decoded.userId)

    return {
        accessToken
    }
}



const logoutService = async function(userData){
    const {refreshToken} = userData;
    if(!refreshToken){
        throw new Error("Refresh token required");
    }

    try{
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch(err){
        throw new Error("Invalid refresh token")
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    })
    if(!storedToken){
        throw new Error("Refresh token not found")
    }
    if(storedToken.revoked){
        throw new Error("Token already revoked")
    }

    await prisma.refreshToken.update({
        where: {
            token: refreshToken
        },
        data: {
            revoked: true
        }
    })

    return{
        message: "Logout successful"
    }
}



const resetPasswordService = async function(email, otp, newPassword){
    if(!email || !otp || !newPassword){
        throw new Error("Email, OTP and new password are required")
    }
    await verifyOtpService(email, otp)
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: {
            email
        },
        data: {
            password: hashedPassword
        }
    })
    return {
        message: "Password reset successfully"
    }

}

const googleLoginService = async function(token){
    if(!token){
        throw new Error("Google token is required");
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload();
    if(!payload){
        throw new Error("Invalid Google Token")
    }
    if(!payload.email_verified){
        throw new Error("Google email not verified")
    }

    let user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })
    if(!user){
        user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: null
            }
        })
    }

    const {accessToken, refreshToken} = await createSession(user.id);
    const { password: _, ...safeUser } = user;
    return {
        message: "Google login successful",
        user: safeUser,
        accessToken,
        refreshToken
    }
    
}


module.exports = {signupService, loginService, getMeService, refreshTokenService, logoutService, resetPasswordService, googleLoginService}