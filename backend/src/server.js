const app = require("./app");
const http = require("http");
const {Server} = require("socket.io")
const prisma = require("./config/db")

const PORT = 3000;

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", function(socket){
    console.log("User connected: ", socket.id)

    socket.on("join-room", async function(roomCode){
        console.log("Joining room:", roomCode)
        socket.join(roomCode)
        
        
        const room = await prisma.room.findUnique({
            where: {
                roomCode
            }
        })
        if(!room){
            return;
        }

        const code = room.currentCode;
        if(!code){
            return;
        }
        
        socket.emit("sync-code", code)
    })




    socket.on("code-change", async function(data){
        const {roomCode, code} = data;
        console.log("Saving code for room:", roomCode);

        await prisma.room.update({
            where: {
                roomCode
            },
            data: {
                currentCode: code
            }
        })



        socket.to(roomCode).emit(
            "code-change",
            code
        )
    })
})


server.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`)
})