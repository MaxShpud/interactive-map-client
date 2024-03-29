import React, { useState, useContext, useEffect } from "react"

import ErrorMessage from "../ErrorMessage"
import { UserContext } from "../../context/UserContext"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './SighInForm.css'

const SignIn = ({theme, setTheme}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setUserData] = useContext(UserContext)
  //const [, setUserRole] = useContext(UserContext)
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
      setUserData({ token: data.access_token, userRole: data.role})

      navigate('/home', {replace: true})
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    submitLogin()
  };

  

  return (
    <div className={`mainContainer ${theme}`}>
      <div className="titleContainer">
        <h1>Login</h1>
      </div>
      
      <form className="box" onSubmit={handleSubmit}>
        <div className="field">
          <div className="control">
            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              type="password"
              placeholder="Enter your password here"
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
          Log in
        </button>
      </form>
      <p className="has-text-centered">
        Don't have an account? <button onClick={() => navigate('register', {replace: false})}>Register here</button>
      </p>
      <Outlet />
    </div>
  );
};

export default SignIn;
