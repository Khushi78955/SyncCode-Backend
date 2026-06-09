import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Room(){

    const {roomId} = useParams()
    const [room, setRoom] = useState(null)

    useEffect(() => {
        async function fetchRoom(){
            try{
                const token = localStorage.getItem("accessToken")
                const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const data = await response.json()
                console.log(data)
                if(!response.ok){
                    alert(data.message)
                    return;
                }
                setRoom(data)
            } catch(err){
                console.log(err)
            }
        }
        fetchRoom()
    }, [])

    if(!room){
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Room Page</h1>
            <p>Room ID: {roomId}</p>

            <hr />
            <p>TItle: {room?.title}</p>
            <p>Language: {room?.language}</p>
            <p>Room Code: {room?.roomCode}</p>
        </div>

    )
}

export default Room; 