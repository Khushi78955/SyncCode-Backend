const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

const {createRoom, joinRoom, getMyRooms, deleteRoom, updateRoom } = require("../controllers/room.controller");

const validate = require("../middleware/validate.middleware")
const {createRoomSchema, joinRoomSchema, updateRoomSchema} = require("../validators/room.validator")
   

    


router.post("/create", authMiddleware, validate(createRoomSchema), createRoom)
router.post("/join", validate(joinRoomSchema), joinRoom)
router.patch("/:id", authMiddleware, validate(updateRoomSchema), updateRoom)
router.get("/my-rooms",authMiddleware, getMyRooms)
router.delete("/:id", authMiddleware, deleteRoom)

router.get("/demo", (req, res) => {
  res.json([
    {
      id: 1,
      name: "DSA Practice",
      language: "JavaScript",
      owner: "Khushi",
    },
    {
      id: 2,
      name: "System Design",
      language: "Python",
      owner: "Rohan",
    },
    {
      id: 3,
      name: "React Interview",
      language: "TypeScript",
      owner: "Priya",
    },
  ]);
});

module.exports = router;