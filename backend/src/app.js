const express = require("express");
const authRouter = require("./routes/auth.routes")
const roomRouter = require("./routes/room.routes")

const app = express()
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/rooms", roomRouter)

module.exports = app;