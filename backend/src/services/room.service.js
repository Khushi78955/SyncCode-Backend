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

const deleteRoomService = async function(roomId, userId){
    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })
    if(!room){
        throw new Error("Room not found")
    }
    if(room.ownerId !== userId){
        throw new Error("Unauthorized")
    }

    await prisma.room.delete({
        where: {
            id: roomId
        }
    })
    return {
        message: "Room deleted successfully"
    }
}


module.exports = {createRoomService, joinRoomService, getMyRoomsService, deleteRoomService}