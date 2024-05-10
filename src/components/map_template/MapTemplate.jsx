import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import {Icon, latLng, divIcon, point, Routing } from "leaflet"
import "leaflet/dist/leaflet.css";
import fort_icon from '../../assets/fort-icon-b.png'
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
import CustomCarousel from "../custom_courusel/CustomCarousel";
import location_pin from '../../assets/location-pin.png'
import RoutingControl from './RoutingControl'

const ResetCenterView = (props) => {
    const { selectPosition } = props;
    const map = useMap();
  
    useEffect(() => {
      if (selectPosition) {
        map.setView(
          latLng(selectPosition?.lat, selectPosition?.lon),
          13,
          {
            animate: true
          }
        )
      }
    }, [selectPosition]);
  
    return null;
  }


const MapTemplate =  (props) => {

    const [markers, setMarkers] = useState([]);
    const [expandedPopups, setExpandedPopups] = useState({});
    const [userData, setUserData] = useContext(UserContext)
    const { selectPosition } = props;
    const [route, setRoute] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const latitude = selectPosition?.lat !== undefined ? selectPosition.lat : 53.7169415;
    const longitude = selectPosition?.lon !== undefined ? selectPosition.lon : 27.9775789;
    const locationSelection = [latitude, longitude];
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("/api/object", {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
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

        console.log("MAPPAPAPAPA", props.waypoints)
        fetchMarkers();
    }, [props.waypoints]);


    
      
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
                    Authorization: `Bearer ${userData.token}`
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
                case "SEARCH":
                    iconUrl = location_pin
                    break
                default:
                    iconUrl = location_pin
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
    
    useEffect(() => {
        const latitude = selectPosition?.lat !== undefined ? selectPosition.lat : 53.7169415;
        const longitude = selectPosition?.lon !== undefined ? selectPosition.lon : 27.9775789;
        const locationSelection = [latitude, longitude];
    
        if (selectPosition) {
            setRoute(null); 
        }
        
    }, [selectPosition]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };
    const filteredMarkers = markers.filter((marker) =>
      marker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return(
        <div className="map-items">
            
            <MapContainer center={locationSelection ? locationSelection : [53.7169415, 27.9775789]} zoom={locationSelection ? 7 : 10}>
            
            <ResetCenterView selectPosition={selectPosition} />
            {props.waypoints && 
            <RoutingControl 
                position={'topleft'} 
                waypoints={props.waypoints}
                setCreatedRoute={props.setCreatedRoute}
                color={'#757de8'} 
            />
            }
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <div className="search-input-container" style = {{zIndex: 3}}>
                <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Поиск по маркерам"
                className="search-input"
                />
            </div>
            {props.waypoints ? null : (
                <MarkerClusterGroup
                chunkedLoading 
                iconCreateFunction={createCustomClusterIcon}
                >
                    {filteredMarkers.map((marker, index) => (
                    // {markers.map((marker, index) => (
                                <Marker key={index} position={marker.coordinates} icon={getMarkerIcon(marker.type)} className="marker-cn">
                                    <Popup className="custom-popup" onClick={(e) => e.stopPropagation()}>
                                    <div className="popup-content">
                                            <div className="marker-info">
                                                <div className="marker-name">{marker.name}</div>
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
                                            <div className="marker-full-info">
                                                
                                                <CustomCarousel>
                                                    {marker.files_base64.map((image, index) => {
                                                    return <img key={index} src={`data:image/jpeg;base64,${image}`} alt={`Image ${index}`} />;
                                                    })}
                                                </CustomCarousel>
                                                <div className="marker-full-info">{marker.location}</div>
                                                <div className="marker-full-info">{marker.coordinates.join(' ')}</div>
                                                <div className="about-place">О месте</div>
                                                <div className="marker-full-info">{marker.description}</div>
                                                <button className="btn-marker" onClick={(e) => { e.stopPropagation(); togglePopupExpansion(marker.id)}}>Скрыть подробную информацию</button>
                                            </div>
                                        ) : (
                                            <button className="btn-marker" onClick={(e) =>{ e.stopPropagation(); togglePopupExpansion(marker.id)}}>Узнать подробнее</button>
                                        )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                </MarkerClusterGroup>
            )}
            
            </MapContainer>
            </div>
    )
}

export default MapTemplate