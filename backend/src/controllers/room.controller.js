const { createRoomService, joinRoomService, getMyRoomsService} = require("../services/room.service") 

const createRoom = async function(req, res){
    try{
        console.log(req.user);
        const result = await createRoomService(
            req.body,
            req.user.userId
        );
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


const joinRoom = async function(req, res){
    try{
        const result = await joinRoomService(req.body);
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

const getMyRooms = async function(req, res){
    try{
        const result = await getMyRoomsService(req.user.userId);
        res.json(result)
    } catch(err){
        res.status(400).json({
            message: err.message
        })
    }

}


module.exports = {createRoom, joinRoom, getMyRooms}