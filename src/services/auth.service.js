const prisma = require("../config/db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");
const { createSession } = require("../utils/session");
const { verifyOtpService } = require("./otp.service")
const { client } = require("../utils/google")
const axios = require("axios")
const AppError = require("../utils/error")

const signupService = async function (userData){
    const {name, email, password} = userData;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existingUser){
        throw new AppError("User already exists", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            provider: "local"
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
        throw new AppError("Invalid email or password", 401);
    }

    if(user.provider !== "local"){
        throw new AppError(`Please login with ${user.provider}`, 401)
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        throw new AppError("Invalid email or password", 401)
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
        throw new AppError("User not found", 404)
    }
    
    const {password: _, ...safeUser } = user
    return safeUser
}



const refreshTokenService = async function(userData){
    const {refreshToken} = userData;
    if(!refreshToken){
        throw new AppError("Refresh token required", 400)
    }

    let decoded;
    try{
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    } catch(err){
        throw new AppError("Invalid refresh token", 401)
    }
    

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    })
    if(!storedToken){
        throw new AppError("Refresh token not found", 404)
    }
    if(storedToken.revoked){
        throw new AppError("Refresh token revoked", 401)
    }
    if(storedToken.expiresAt < new Date()){
        throw new AppError("Refresh token expired", 401)
    }

    const accessToken = generateAccessToken(decoded.userId)

    return {
        accessToken
    }
}



const logoutService = async function(userData){
    const {refreshToken} = userData;
    if(!refreshToken){
        throw new AppError("Refresh token required", 400);
    }

    try{
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch(err){
        throw new AppError("Invalid refresh token", 401)
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    })
    if(!storedToken){
        throw new AppError("Refresh token not found", 404)
    }
    if(storedToken.revoked){
        throw new AppError("Token already revoked", 401)
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
        throw new AppError("Email, OTP and new password are required", 400)
    }
    await verifyOtpService(email, otp)
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new AppError("User not found", 404);
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
        throw new AppError("Google token is required", 400);
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload();
    if(!payload){
        throw new AppError("Invalid Google Token", 401)
    }
    if(!payload.email_verified){
        throw new AppError("Google email not verified", 401)
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
                password: null,
                provider: "google"
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




const githubLoginService = async function(token){
    if(!token){
        throw new AppError("GitHub token is required", 400);
    }

    const {data: githubUser} = await axios.get(
        "https://api.github.com/user",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    const {data: emails} = await axios.get(
        "https://api.github.com/user/emails",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const primaryEmail = emails.find(email => email.primary)
    if(!primaryEmail){
        throw new AppError("GitHub email not found", 404)
    }

    
    let user = await prisma.user.findUnique({
        where: {
            email: primaryEmail.email
        }
    })
    if(!user){
        user = await prisma.user.create({
            data: {
                name: githubUser.name || githubUser.login,
                email: primaryEmail.email,
                password: null,
                provider: "github"
            }
        })
    }

    const {accessToken, refreshToken} = await createSession(user.id);
    const { password: _, ...safeUser } = user;
    return {
        message: "Github login successful",
        user: safeUser,
        accessToken,
        refreshToken
    }
    
}

const discordLoginService = async function(token){
    if(!token){
        throw new AppError("Discord token is required", 400);
    }

    const {data: discordUser} = await axios.get(
        "https://discord.com/api/users/@me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    
    if(!discordUser.email){
        throw new AppError("Discord email not found", 404)
    }

    
    let user = await prisma.user.findUnique({
        where: {
            email: discordUser.email
        }
    })
    if(!user){
        user = await prisma.user.create({
            data: {
                name: discordUser.global_name || discordUser.username,
                email: discordUser.email,
                password: null,
                provider: "discord"
            }
        })
    }

    const {accessToken, refreshToken} = await createSession(user.id);
    const { password: _, ...safeUser } = user;
    return {
        message: "Discord login successful",
        user: safeUser,
        accessToken,
        refreshToken
    }
    
}

module.exports = {signupService, loginService, getMeService, refreshTokenService, logoutService, resetPasswordService, googleLoginService, githubLoginService, discordLoginService}

