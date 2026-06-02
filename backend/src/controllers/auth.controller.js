const {signupService, loginService} = require("../services/auth.service")

const signup = async function (req, res){
    try{
        const result = await signupService(req.body)
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


const login = async function(req, res){
    try{
        const result = await loginService(req.body);
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }   
}

module.exports = {signup, login}