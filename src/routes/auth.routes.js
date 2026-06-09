const express = require("express");
const router = express.Router();
const { apiLimiter } = require("../middleware/rateLimit.middleware")


const {signup, login, getMe, refreshToken, logout, resetPassword, googleLogin, githubLogin, discordLogin} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware")
const {signupSchema, loginSchema, resetPasswordSchema, refreshTokenSchema, logoutSchema, oauthSchema} = require("../validators/auth.validator")


router.post("/signup", apiLimiter, validate(signupSchema), signup)
router.post("/login", apiLimiter, validate(loginSchema),login)
router.get("/me", authMiddleware, getMe)
router.post("/reset-password", apiLimiter, validate(resetPasswordSchema), resetPassword)
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken)
router.post("/logout", validate(logoutSchema), logout)
router.post("/google", apiLimiter, validate(oauthSchema), googleLogin)
router.post("/github", apiLimiter, validate(oauthSchema), githubLogin)
router.post("/discord", apiLimiter, validate(oauthSchema), discordLogin)


module.exports = router;
