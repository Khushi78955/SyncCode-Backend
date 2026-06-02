const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

const {createRoom, joinRoom, getMyRooms } = require("../controllers/room.controller");


router.post("/create", authMiddleware, createRoom)
router.post("/join", joinRoom)
router.get("/my-rooms",authMiddleware, getMyRooms)


module.exports = router;