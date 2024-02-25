import React, { useContext, useState, useEffect } from "react";
import './Home.css'
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";


const Home = () => {
    const [token] = useContext(UserContext)
    const current_theme = localStorage.getItem('current_theme')
    const [theme, setTheme] = useState(current_theme? current_theme: 'light')

    useEffect(()=>{
        localStorage.setItem('current_theme', theme)
    }, [theme])

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    if (!token) {
        navigate('/', {replace: true})
    }
    
    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
        </div>
    )
}

export default Home