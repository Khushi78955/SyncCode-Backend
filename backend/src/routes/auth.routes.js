const express = require("express");
const router = express.Router();


const {signup, login, getMe, refreshToken, logout, resetPassword, googleLogin} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.post("/signup", signup)
router.post("/login", login)
router.get("/me", authMiddleware, getMe)
router.post("/reset-password", resetPassword)
router.post("/refresh-token", refreshToken)
router.post("/logout", logout)
router.post("/google", googleLogin)
module.exports = router;
