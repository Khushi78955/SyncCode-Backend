const jwt = require("jsonwebtoken")
const authMiddleware = function(req, res, next){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    console.log(req.user);
    next()
}

module.exports = authMiddleware