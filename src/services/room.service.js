const prisma = require("../config/db")
const AppError = require("../utils/error")


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
        throw new AppError("Room not found", 404)
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

const getRoomByIdService = async function(roomId){
    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })
    if(!room){
        throw new AppError("Room not found", 404)
    }
    return room;
}


const deleteRoomService = async function(roomId, userId){
    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })
    if(!room){
        throw new AppError("Room not found", 404)
    }
    if(room.ownerId !== userId){
        throw new AppError("Unauthorized", 403)
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


const updateRoomService = async function(roomId, userId, updateData){
    const room = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })
    if(!room){
        throw new AppError("Room not found", 404)
    }
    if(room.ownerId !== userId){
        throw new AppError("Unauthorized", 403)
    }
    const updatedRoom = await prisma.room.update({
        where: {
            id: roomId
        },
        data: updateData
    })
    return updatedRoom
}

module.exports = {createRoomService, joinRoomService, getMyRoomsService, deleteRoomService, updateRoomService, getRoomByIdService}