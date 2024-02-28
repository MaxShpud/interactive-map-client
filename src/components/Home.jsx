import React, { useContext, useState, useEffect } from "react";
import './Home.css'
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import Map from "./map/Map";



const Home = ({theme, setTheme}) => {
    const [userData] = useContext(UserContext)
    //const [userRole] = useContext(UserContext)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    if (!userData.token) {
        navigate('/', {replace: true})
    }

    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
        </div>
    )
}

export default Home