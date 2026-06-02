const { createRoomService, joinRoomService } = require("../services/room.service") 

const createRoom = async function(req, res){
    try{
        const result = await createRoomService(req.body);
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
module.exports = {createRoom, joinRoom}