const jwt = require("jsonwebtoken")
const authMiddleware = function(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Token required"
        })
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()
    } catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
    
}

module.exports = authMiddleware