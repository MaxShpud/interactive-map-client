import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import {Icon, latLng, divIcon, point } from "leaflet"
import fort_icon from '../../assets/fort-icon-b.png'
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from "react-leaflet-cluster";
import "./MapTemplate.css"
import fav_unselected from '../../assets/favourite_unselected.png'
import fav_selected from '../../assets/favourite_selected.png'
import acrchitecture_icon from '../../assets/markers/architecture.svg'
import cultural_site_icon from '../../assets/markers/cultural_site.svg'
import museum_icon from '../../assets/markers/museum.svg'
import natural_reserve_icon from '../../assets/markers/natural_reserve.svg'
import nature_icon from '../../assets/markers/nature.svg'
import religion_icon from '../../assets/markers/religion.svg'
import war_monument_icon from '../../assets/markers/war_monument.svg'

const MapTemplate = ({token}) => {

    const [markers, setMarkers] = useState([]);
    const [expandedPopups, setExpandedPopups] = useState({});

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
    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className:"custom-cluster-icon",
            iconSize: point(33,33,true)
        })
    }


    const handleMarkerPhotoClick = async (marker) => {
        const isFavourite = marker.is_favourite;

        try {
            const response = await fetch(`/api/object?object_id=${marker.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ is_favourite: !isFavourite })
            });

            if (response.ok) {
                const updatedMarker = await response.json();
                const updatedMarkers = markers.map((marker) =>
                marker.id === updatedMarker.id ? updatedMarker : marker
                );
                setMarkers(updatedMarkers);
            } else {
                console.error("Failed to update marker");
            }
        } catch (error) {
            console.error("Error updating marker:", error);
        }
    };

    const getMarkerIcon = (markerType) => {
        let iconUrl
        switch(markerType) {
                case "ARCHITECTURE": 
                     iconUrl = acrchitecture_icon
                     break
                case "NATURAL_RESERVES":
                    iconUrl = natural_reserve_icon
                    break
                case "RELIGION":
                    iconUrl = religion_icon
                    break
                case "NATURE":
                    iconUrl = nature_icon
                    break
                case "MUSEUMS":
                    iconUrl = museum_icon
                    break
                case "WAR_MONUMENTS":
                    iconUrl = war_monument_icon
                    break
                case "CULTURAL_SITES": 
                    iconUrl = cultural_site_icon
                    break
                default:
                    iconUrl = acrchitecture_icon
        }
        return new Icon({
            iconUrl: iconUrl,
            iconSize: [30,30],
        })
    }
    const togglePopupExpansion = (markerId) => {
        setExpandedPopups((prevState) => ({
            ...prevState,
            [markerId]: !prevState[markerId],
        }));
    };

    return(
        <div className="map-items">
            <MapContainer center={[53.7169415, 27.9775789]} zoom={7} >

            <TileLayer
                // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
            chunkedLoading 
            iconCreateFunction={createCustomClusterIcon}
            >
                {markers.map((marker, index) => (
                            <Marker key={index} position={marker.coordinates} icon={getMarkerIcon(marker.type)} className="marker-cn">
                                <Popup onClick={(e) => e.stopPropagation()}>
                                <div className="popup-content">
                                        <div className="marker-info">
                                            {marker.name}
                                            <img
                                                src={
                                                    marker.is_favourite
                                                        ? fav_selected
                                                        : fav_unselected
                                                }
                                                alt="Favourite"
                                                className="marker-photo"
                                                onClick={(e) =>{e.stopPropagation();
                                                    handleMarkerPhotoClick(
                                                        marker
                                                    )}
                                                }
                                            />
                                        </div>
                                        {expandedPopups[marker.id] ? (
                                        <>
                                            {console.log("FULL", marker)}
                                            <div>{marker.name}</div>
                                            <div>{marker.coordinates}</div>
                                            <div>{marker.location}</div>
                                            <div>{marker.description}</div>
                                            <button onClick={(e) => { e.stopPropagation(); togglePopupExpansion(marker.id)}}>Скрыть подробную информацию</button>
                                        </>
                                    ) : (
                                        <button onClick={(e) =>{e.stopPropagation(); togglePopupExpansion(marker.id)}}>Узнать подробнее</button>
                                    )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

            </MarkerClusterGroup>
            </MapContainer>
            </div>
    )
}

export default MapTemplate