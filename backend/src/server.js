const app = require("./app");
const http = require("http");
const {Server} = require("socket.io")

const PORT = 3000;

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", function(socket){
    console.log("User connected: ", socket.id)
    socket.on("join-room", function(roomCode){
        console.log("Joining room:", roomCode)
        socket.join(roomCode)
    })
    socket.on("code-change", function(data){
        const {roomCode, code} = data;
        socket.to(roomCode).emit(
            "code-change",
            code
        )
    })
})


server.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`)
})