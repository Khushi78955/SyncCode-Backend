const prisma = require("../config/db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");
const { createSession } = require("../utils/session");

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

module.exports = {signupService, loginService, getMeService, refreshTokenService, logoutService}