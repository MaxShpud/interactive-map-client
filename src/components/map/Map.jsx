import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import {Icon, latLng, divIcon, point } from "leaflet"
import fort_icon from '../../assets/fort-icon-b.png'
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css"
import fav_unselected from '../../assets/favourite_unselected.png'
import fav_selected from '../../assets/favourite_selected.png'
import acrchitecture_icon from '../../assets/markers/architecture.svg'
import cultural_site_icon from '../../assets/markers/cultural_site.svg'
import museum_icon from '../../assets/markers/museum.svg'
import natural_reserve_icon from '../../assets/markers/natural_reserve.svg'
import nature_icon from '../../assets/markers/nature.svg'
import religion_icon from '../../assets/markers/religion.svg'
import war_monument_icon from '../../assets/markers/war_monument.svg'
import MapTemplate from "../map_template/MapTemplate";

// const markerIcon = new Icon({
//     iconUrl: fort_icon,
//     iconSize: [40,40]
// })


const Map = ({theme, setTheme}) => {
    const [userData, setUserData] = useContext(UserContext)
    //const token = localStorage.getItem('mapToken')
    

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
            <div className="map-template">
                <MapTemplate token={userData.token}/>
            </div>
            
        </div>
    )
}

export default Map