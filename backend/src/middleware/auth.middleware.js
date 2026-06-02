const jwt = require("jsonwebtoken")
const authMiddleware = function(req, res, next){
    const token = req.headers.authorization;
    console.log(token);
    next();
}

module.exports = authMiddleware