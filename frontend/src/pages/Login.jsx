import { useState } from "react";
import { useNavigate } from "react-router-dom"

function Login(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    async function handleLogin(){
        try{
            const response = await fetch("http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )
            const data = await response.json()
            console.log(data)
            if(!response.ok){
                alert(data.message);
                return;
            }
            localStorage.setItem("accessToken", data.accessToken)
            localStorage.setItem("refreshToken", data.refreshToken)
            navigate("/dashboard")
        
        } catch(err){
            console.log(err)
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter Email"/>

            <br />
            <br />

            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />

            <br />
            <br />

            <button onClick={handleLogin}>Login</button>

            <p>Email: {email}</p>
            <p>Password: {password}</p>
        </div>
    )
}

export default Login