const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

const {createRoom, joinRoom, getMyRooms, deleteRoom, updateRoom } = require("../controllers/room.controller");


router.post("/create", authMiddleware, createRoom)
router.post("/join", joinRoom)
router.get("/my-rooms",authMiddleware, getMyRooms)
router.delete("/:id", authMiddleware, deleteRoom)
router.patch("/:id", authMiddleware, updateRoom)


module.exports = router;