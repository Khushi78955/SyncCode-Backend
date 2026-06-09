import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRooms(){
            try {
                const token = localStorage.getItem("accessToken")

                const response = await fetch("http://localhost:3000/api/rooms/my-rooms",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const data = await response.json();
                console.log(data)
                if(Array.isArray(data)){
                    setRooms(data)
                }
            } catch(err){
                console.log(err)
            }
        } 
        fetchRooms()
    }, [])



    async function handleLogout(){
        try{
            const refreshToken = localStorage.getItem("refreshToken")
            const response = await fetch("http://localhost:3000/api/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refreshToken
                    })
                }
            )
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                alert(data.message);
                return;
            }
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            navigate("/login")
        } catch(err){
            console.log(err)
        }
    }
    return(
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => navigate("/create-room")}>Create Room</button>
            <button onClick={handleLogout}>Logout</button>
            <p>Total Rooms: {rooms.length}</p>
            {rooms.map((room)=>(
                <div key={room.id}>
                    <h3>{room.title}</h3>
                    <p>{room.language}</p>

                    <button onClick={() => navigate(`/room/${room.id}`)}>Open</button>
                </div>
            ))}

            

        </div>
    )
}

export default Dashboard