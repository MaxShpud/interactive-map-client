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
import SearchBox from "../map_template/search_box/SearchBox";
import { Input, Button, List, ListItem, Image, Divider, Text, ThemeIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// const markerIcon = new Icon({
//     iconUrl: fort_icon,
//     iconSize: [40,40]
// })


const Map = ({theme, setTheme}) => {
    const [userData, setUserData] = useContext(UserContext)
    //const token = localStorage.getItem('mapToken')
    const [selectPosition, setSelectPosition] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
    
    
    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    if (!userData.token) {
        
        navigate('/', {replace: true})
    }
    useEffect(() => {
        if (selectPosition !== null) {
            close();
        }
    }, [selectPosition, close]);

    return (
        <>
        <Modal className="modal" opened={opened} onClose={() => {
              close();
                }} title="Поиск локации" 
                >
                <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}/>
            </Modal>
        <div className={`container ${theme}`}>
            
            <NavBar theme={theme} setTheme={setTheme}/>
            
            <Button onClick={open} style={{ marginTop: "10px", border: "10px" }}>Найти локацию</Button>
            <div className="map-template">
                <MapTemplate selectPosition={selectPosition}/>
            </div>
            
        </div>
        </>
        
    )
}

export default Map