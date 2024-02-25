import React, { useState, useContext, useEffect } from "react"

import ErrorMessage from "./ErrorMessage"
import { UserContext } from "../context/UserContext"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setToken] = useContext(UserContext)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Current location is ', location)
  }, [location])

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("/api/login/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail)
    } else {
      setToken(data.access_token)
      navigate('/home', {replace: true})
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    submitLogin()
  };

  

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Login</h1>
        <div className="field">
          <label className="label">Email Address</label>
          <div className="control">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="button is-primary" type="submit">
          Login
        </button>
      </form>
      <p className="has-text-centered">
        Don't have an account? <button onClick={() => navigate('register', {replace: false})}>Register here</button>
      </p>
      <hr />
      <Outlet />
    </div>
  );
};

export default Login;
