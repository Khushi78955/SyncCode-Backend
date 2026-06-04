const { createRoomService, joinRoomService, getMyRoomsService, deleteRoomService, updateRoomService} = require("../services/room.service") 

const createRoom = async function(req, res, next){
    try{
        console.log(req.user);
        const result = await createRoomService(
            req.body,
            req.user.userId
        );
        res.json(result)
    } catch(err){
        next(err)
    }
}


const joinRoom = async function(req, res, next){
    try{
        const result = await joinRoomService(req.body);
        res.json(result)
    } catch(err){
        next(err)
    }
}

const getMyRooms = async function(req, res, next){
    try{
        const result = await getMyRoomsService(req.user.userId);
        res.json(result)
    } catch(err){
        next(err)
    }

}


const deleteRoom = async function(req, res, next){
    try{
        const result = await deleteRoomService(req.params.id, req.user.userId);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}
const updateRoom = async function(req, res, next){
    try{
        const result = await updateRoomService(req.params.id, req.user.userId, req.body);
        res.json(result)
    } catch(err){
        next(err)
    }
    
}

module.exports = {createRoom, joinRoom, getMyRooms, deleteRoom, updateRoom}