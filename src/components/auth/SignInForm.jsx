import React, { useState, useContext, useEffect } from "react"

import ErrorMessage from "../ErrorMessage"
import { UserContext } from "../../context/UserContext"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './SighInForm.css'
import { Button } from '@mantine/core';

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
        <h1>Авторизация</h1>
      </div>
      
      <form className="box" onSubmit={handleSubmit}>
        <div className="field">
          <div className="control">
            <input
              type="email"
              placeholder="Введите email"
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
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        {/* <button className="button is-primary" type="submit">
          Log in
        </button> */}
        <Button
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          type="submit"
        >
          Авторизоваться
        </Button>
      </form>
      
      <p className="has-text-centered">
        Нет аккаунта? <button onClick={() => navigate('register', {replace: false})}>Зарегистрируйтесь здесь</button>
      </p>
      <Outlet />
    </div>
  );
};

export default SignIn;
