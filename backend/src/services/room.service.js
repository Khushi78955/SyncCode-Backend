const prisma = require("../config/db")

const createRoomService = async function(roomData){
    const {title, language, ownerId} = roomData;
    const roomCode = Math.random().toString(36).substring(2,8).toUpperCase()
    const room = await prisma.room.create({
        data: {
            title,
            language,
            ownerId,
            roomCode
        }
    })
    return room;

}


const joinRoomService = async function(roomData){
    const {roomCode} = roomData;
    const room = await prisma.room.findUnique({
        where:{
            roomCode
        }
    })
    if(!room){
        throw new Error("Room not found")
    }

    return {
        message: "Room joined successfully",
        room
    }
}

module.exports = {createRoomService, joinRoomService}