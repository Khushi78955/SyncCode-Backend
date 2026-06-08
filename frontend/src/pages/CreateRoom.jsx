import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoom(){
    const navigate = useNavigate();
    const [title, setTitle] = useState("")
    const [language, setLanguage] = useState("JAVASCRIPT")

    async function handleCreateRoom(){
        try{
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:3000/api/rooms/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        language
                    })
                }
            )
            const data = await response.json();
            console.log(data)
            if(!response.ok){
                alert(data.message);
                return;
            }
            navigate("/dashboard")
        } catch(err){
            console.log(err)
        }
        
    }

    return(
        <div>
            <h1>Create Room</h1>
            <p>Title: {title}</p>
            <input 
                type="text" 
                value={title}
                onChange={(event) => setTitle(event.target.value)} 
                placeholder="Enter room title"
            />

            <br />
            <br />

            <p>Language: {language}</p>

            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="JAVASCRIPT">JAVASCRIPT</option>
                <option value="PYTHON">PYTHON</option>
                <option value="JAVA">JAVA</option>
                <option value="CPP">CPP</option>
            </select>

            <br />
            <br />

            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    )
}


export default CreateRoom