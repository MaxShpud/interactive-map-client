import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Routing } from "leaflet";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import "leaflet/dist/leaflet.css"
import MapTemplate from "../map_template/MapTemplate";
import SearchBox from "../map_template/search_box/SearchBox";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import CardRoute from "./CardRoute";



const Route = ({theme, setTheme}) => {
    const [userData, setUserData] = useContext(UserContext)
    const [selectPosition, setSelectPosition] = useState(null);

    const location = useLocation()
    const navigate = useNavigate()

    const [waypoints, setWaypoints] = useState([]);
    
    const updateWaypoints = (newWaypoints) => {
      setWaypoints(newWaypoints);
    };
    
    useEffect(() => {
        console.log('Current location is ', location)
        console.log("ROUTEROYUTEm" ,waypoints)
    }, [location, waypoints])

    if (!userData.token) {
        
        navigate('/', {replace: true})
    }
    
    

    return (
        <div className={`container ${theme}`}>
          <NavBar theme={theme} setTheme={setTheme}/>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1' , zIndex:2}}>
              <CardRoute updateWaypoints={updateWaypoints}/>
            </div>
            <div style={{ flex: '3' , zIndex:1}}>
              <div className="map-template">
              <MapTemplate key={JSON.stringify(waypoints)} selectPosition={selectPosition} waypoints={waypoints}/>
              </div>
            </div>
          </div>
        </div>
      )
      
      
      
}

export default Route