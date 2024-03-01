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
import fav_unselected from '../../assets/favourite_unselected.png'
import fav_selected from '../../assets/favourite_selected.png'

const markerIcon = new Icon({
    iconUrl: fort_icon,
    iconSize: [40,40]
})


const Map = ({theme, setTheme}) => {
    const [userData, setUserData] = useContext(UserContext)
    const token = localStorage.getItem('mapToken')
    const [markers, setMarkers] = useState([]);
    const [showMarkerForm, setShowMarkerForm] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

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

    const handleMarkerButtonClick = (marker) => {
        setSelectedMarker(marker);
        setShowMarkerForm(true);
    };
    console.log("marker", markers)

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
                {markers.map((marker, index) => (
                            <Marker key={index} position={marker.coordinates} icon={markerIcon} className="marker-cn">
                                <Popup >
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
                                                onClick={() =>
                                                    handleMarkerPhotoClick(
                                                        marker
                                                    )
                                                }
                                            />
                                        </div>
                                        <button onClick={() => handleMarkerButtonClick(marker)}>
                                            Click
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

            </MarkerClusterGroup>
            
            
            </MapContainer>
            </div>
        </div>
    )
}

export default Map