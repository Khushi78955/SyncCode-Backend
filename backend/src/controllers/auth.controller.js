const {signupService, loginService,  getMeService, refreshTokenService, logoutService, resetPasswordService, googleLoginService, githubLoginService, discordLoginService} = require("../services/auth.service")

const signup = async function (req, res, next){
    try{
        const result = await signupService(req.body)
        res.json(result)
    } catch(err){
        next(err)
    }
}


const login = async function(req, res, next){
    try{
        const result = await loginService(req.body);
        res.json(result)
    } catch(err){
        next(err)
    }   
}


const getMe = async function(req, res, next){
    try{
        const result = await getMeService(req.user.userId);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}


const refreshToken = async function(req, res, next){
    try{
        const result = await refreshTokenService(req.body);
        res.json(result);
    } catch(err){
        next(err)
    }
    
}


const logout = async function(req, res, next){
    try{
        const result = await logoutService(req.body);
        res.json(result);
    } catch(err){
        next(err)
    }
    
}

const resetPassword = async function(req, res, next){
    try{
        const result = await resetPasswordService(req.body.email, req.body.otp, req.body.newPassword);
        res.json(result)
    } catch(err){
        next(err)
    }
    

}

const googleLogin = async function(req, res, next){
    try{
        const result = await googleLoginService(req.body.token);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}


const githubLogin = async function(req, res, next){
    try{
        const result = await githubLoginService(req.body.token);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}

const discordLogin = async function(req, res, next){
    try{
        const result = await discordLoginService(req.body.token);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}

module.exports = {signup, login, getMe, refreshToken, logout, resetPassword, googleLogin, githubLogin, discordLogin}