const express = require("express");
const helmet = require("helmet");
const authRouter = require("./routes/auth.routes")
const roomRouter = require("./routes/room.routes");
const otpRouter = require("./routes/otp.routes")

const errorMiddleware = require("./middleware/error.middleware");


const app = express()
app.use(express.json())
app.use(helmet())

app.use("/api/auth", authRouter)
app.use("/api/rooms", roomRouter)
app.use("/api/otp", otpRouter)

app.use(errorMiddleware)

module.exports = app;