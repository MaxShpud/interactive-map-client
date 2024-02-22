import React, { useContext, useState } from "react";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const[, setToken] = useContext(UserContext)


    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: name, surname: surname, email: email, password: password})
        }

        const response = await fetch("/api/user/create", requestOptions)
        const data = await response.json()
        
        if(!response.ok) {
            setErrorMessage(data.detail)
        } else {
            setToken(data.access_token)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password.length >= 5) {
            submitRegistration()
        } else {
            setErrorMessage("Ensure that the password greater than 5 characters")
        }
    }
    
    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Surname</label>
                    <div className="control">
                        <input type="text" 
                        placeholder="Enter your surname" 
                        value={surname} 
                        onChange={(e) => setSurname(e.target.value)}
                        className="input"
                        required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email Adress</label>
                    <div className="control">
                        <input type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" 
                        placeholder="Enter password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required/>
                    </div>
                </div>
                <ErrorMessage message={errorMessage} />
                <br/>
                <button className="button is-primary" type="submit">Register</button>
            </form>
        </div>
    )
}
export default Register