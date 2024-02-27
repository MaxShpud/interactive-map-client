import React, { useContext, useState, useEffect } from "react";
import './Home.css'
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import "leaflet/dist/leaflet.css"



const Home = ({theme, setTheme}) => {
    const [token] = useContext(UserContext)
    
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
            <div className="map-items">
            <MapContainer center={[40.505, -100.09]} zoom={13} >
  
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[40.505, -100.09]}>
                <Popup>
                    I am a pop-up!
                </Popup>
            </Marker>
            </MapContainer>
            </div>
        </div>
    )
}

export default Home