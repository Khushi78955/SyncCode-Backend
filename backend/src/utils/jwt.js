const jwt = require("jsonwebtoken")

const generateAccessToken = function(userId){
    return jwt.sign(
        {
            userId
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}


const generateRefreshToken = function(userId){
    return jwt.sign(
        {
            userId
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}

module.exports = {generateAccessToken, generateRefreshToken}