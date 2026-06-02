const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

const {createRoom, joinRoom } = require("../controllers/room.controller");


router.post("/create", authMiddleware, createRoom)
router.post("/join", joinRoom)


module.exports = router;