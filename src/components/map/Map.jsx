import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import {Icon, latLng, divIcon, point } from "leaflet"
import fort_icon from '../../assets/pin-point.png'
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css"

const markerIcon = new Icon({
    iconUrl: fort_icon,
    iconSize: [40,40]
})


const Map = ({theme, setTheme}) => {
    const [userData, setUserData] = useContext(UserContext)
    const token = localStorage.getItem('mapToken')
    const [markers, setMarkers] = useState([]);
    
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("/api/object", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMarkers(data.objects);
                    
                } else {
                    console.error('Failed to fetch objects data');
                } 
            } catch (error) {
                console.error("Error fetching markers:", error);
            }
        };

        fetchMarkers();
    }, []);
    
    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    if (!userData.token) {
        
        navigate('/', {replace: true})
    }
    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className:"custom-cluster-icon",
            iconSize: point(33,33,true)
        })
    }
    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
            <div className="map-items">
            <MapContainer center={[53.7169415, 27.9775789]} zoom={7} >

            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
            chunkedLoading 
            iconCreateFunction={createCustomClusterIcon}
            >
                <Marker 
                    position={new latLng(52.048022, 23.672885)}
                    icon={markerIcon}>
                    <Popup>Форт №5 Брестской крепости</Popup>
                </Marker>
                <Marker 
                    position={new latLng(52.083423, 23.654902)}
                    icon={markerIcon}>
                    <Popup>Брестская крепость-герой</Popup>
                </Marker>
                <Marker 
                    position={new latLng(52.086684, 23.686450)}
                    icon={markerIcon}>
                    <Popup>Музей спасенных художественных ценностей</Popup>
                </Marker>
            </MarkerClusterGroup>
            
            {/* {markers.map(marker =>  (
                <Marker key = {marker.id}
                position={new latLng(marker.latitude, marker.longitude)}
                icon={markerIcon}>
                <Popup>{marker.name}</Popup>
                </Marker>
            ))} */}
            </MapContainer>
            </div>
        </div>
    )
}

export default Map