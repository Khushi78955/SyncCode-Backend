import { useState } from "react";


function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    async function handleLogin(){
        try{
            const response = await fetch("http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            )
            const data = await response.json()
            console.log(data);
        } catch(err){
            console.log(err)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter Email"/>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />

            <button onClick={handleLogin}>Login</button>

            <p>Email: {email}</p>
            <p>Password: {password}</p>
        </div>
    )
}

export default Login