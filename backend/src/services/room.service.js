const prisma = require("../config/db")

const createRoomService = async function(roomData, userId){
    const {title, language} = roomData;
    const roomCode = Math.random().toString(36).substring(2,8).toUpperCase()
    const room = await prisma.room.create({
        data: {
            title,
            language,
            ownerId: userId,
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

const getMyRoomsService = async function(userId){
    const rooms = await prisma.room.findMany({
        where: {
            ownerId: userId
        }
    })
    return rooms;
}


module.exports = {createRoomService, joinRoomService, getMyRoomsService}