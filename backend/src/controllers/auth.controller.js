const {signupService, loginService,  getMeService, refreshTokenService, logoutService} = require("../services/auth.service")

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


const getMe = async function(req, res){
    try{
        const result = await getMeService(req.user.userId);
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
}


const refreshToken = async function(req, res){
    try{
        const result = await refreshTokenService(req.body);
        res.json(result);
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
}


const logout = async function(req, res){
    try{
        const result = await logoutService(req.body);
        res.json(result);
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
    
}




module.exports = {signup, login, getMe, refreshToken, logout}