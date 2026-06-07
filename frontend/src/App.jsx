import Navbar from "./components/Navbar";
import RoomCard from "./components/RoomCard";
import Footer from "./components/Footer";

function App(){
 const rooms = [
  {
    id: 1,
    name: "DSA Practice",
    language: "JavaScript",
    owner: "Khushi"
  },
  {
    id: 2,
    name: "System Design",
    language: "Python",
    owner: "Rohan"
  },
  {
    id: 3,
    name: "React Interview",
    language: "TypeScript",
    owner: "Priya"
  }
];

  return(
    <div>
      <Navbar />

      <h2>My Rooms</h2>

      {rooms.map((room) => (
        <RoomCard 
          key={room.id} 
          room={room}
        />
      ))}

      <Footer />


    </div>
  )
}

export default App;