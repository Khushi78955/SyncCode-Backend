function RoomCard({room}){
    return(
        <div>
            <h2>{room.name}</h2>
            <p>Language: {room.language}</p>
            <p>Owner: {room.owner}</p>
        </div>
    )
}

export default RoomCard;