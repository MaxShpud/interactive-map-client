import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "../navbar/NavBar";
import './Favourite.css'
import fav_unselected from '../../assets/favourite_unselected.png'
import fav_selected from '../../assets/favourite_selected.png'
import CustomCarousel from "../custom_courusel/CustomCarousel";

const Favourite = ({theme, setTheme}) => {
    const [favouriteObjects, setFavouriteObjects] = useState([]);
    const [userData] = useContext(UserContext)
    //const [userRole] = useContext(UserContext)
    const location = useLocation()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("/api/object/favourite", {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavouriteObjects(data.objects);
                } else {
                    console.error('Failed to fetch objects data');
                } 
            } catch (error) {
                console.error("Error fetching markers:", error);
            }
        };

        fetchMarkers();
    }, []);

    console.log("OBJ",favouriteObjects)
    if (!userData.token) {
        navigate('/', {replace: true})
    }

    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
            <div className="split-container">
                <div className="locations">
                    <h2>Локации</h2>
                    <div >
                    {favouriteObjects.map((favObject, index) => (
                            <div className="fav-object-content">
                                        <div className="fav-object-name">{favObject.name}</div>
                                        <img
                                            src={
                                                favObject.is_favourite
                                                    ? fav_selected
                                                    : fav_unselected
                                            }
                                            alt="Favourite"
                                            className="fav-object-photo"
                                            onClick={(e) =>{e.stopPropagation();
                                                handleMarkerPhotoClick(
                                                    marker
                                                )}
                                            }
                                        />
                                        <div className="fav-object-full-info">
                                            
                                            <CustomCarousel>
                                                {favObject.files_base64.map((image, index) => {
                                                return <img key={index} src={`data:image/jpeg;base64,${image}`} alt={`Image ${index}`} />;
                                                })}
                                            </CustomCarousel>
                                            <div>{favObject.location}</div>
                                            <div>{favObject.coordinates.join(' ')}</div>
                                            <div>О месте</div>
                                            <div>{favObject.description}</div>
                                        </div>
            
                            </div>
                        ))}
                    </div>
                </div>
                <div className="routes">
                    <h2>Маршруты</h2>
                    <div className="scrollable-content">
                        {/* Здесь будет контент для маршрутов */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Favourite