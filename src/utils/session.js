const prisma = require("../config/db")
const { generateAccessToken, generateRefreshToken } = require("./jwt")

const createSession = async function(userId){
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    const days = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN)
    
    const expiresAt = new Date()

    expiresAt.setDate(expiresAt.getDate()+days)

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            expiresAt,
            userId
        }
    })

    return {
        accessToken,
        refreshToken
    }
}

module.exports = {createSession}