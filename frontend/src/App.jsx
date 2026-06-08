import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import RoomCard from "./components/RoomCard";
import Footer from "./components/Footer";


function App(){

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(() => {
    async function fetchRooms(){
      try{
        const response = await fetch("http://localhost:3000/api/rooms/demo")
        const data = await response.json()
        setRooms(data);
        setLoading(false)
      } catch(err){
        setError("Failed to fetch rooms");
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])


  if (loading) {
    return <p>Loading Rooms...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return(
    <div>
      <Navbar />

      <h2>My Rooms</h2>

      {rooms.map((room) => (
        <RoomCard 
          key = {room.id}
          room = {room}
        />
      ))}

      <Footer />


    </div>
  )
}

export default App;