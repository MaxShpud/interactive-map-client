import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "../navbar/NavBar";
import './Favourite.css'
import fav_unselected from '../../assets/favourite_unselected.png'
import fav_selected from '../../assets/favourite_selected.png'
import CustomCarousel from "../custom_courusel/CustomCarousel";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

const Favourite = ({theme, setTheme}) => {
    const [favouriteObjects, setFavouriteObjects] = useState([]);
    const [userData] = useContext(UserContext)
    const [expandedPopups, setExpandedPopups] = useState({})
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



    const handleMarkerPhotoClick = async (favObject) => {
        const isFavourite = favObject.is_favourite;

        try {
            const response = await fetch(`/api/object?object_id=${favObject.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData.token}`
                },
                body: JSON.stringify({ is_favourite: !isFavourite })
            });

            if (response.ok) {
                const updatedObject = await response.json();
                const updatedObjects = favouriteObjects.map((favObject) =>
                favObject.id === updatedObject.id ? updatedObject : favObject
                );
                setFavouriteObjects(updatedObjects);
            } else {
                console.error("Failed to update object");
            }
        } catch (error) {
            console.error("Error updating object:", error);
        }
    };

    const togglePopupExpansion = (objectId) => {
        setExpandedPopups((prevState) => ({
            ...prevState,
            [objectId]: !prevState[objectId],
        }));
    };

    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
            <div className="split-container">
                <div className="locations">
                    <h2>Локации</h2>
                    <div className="cards">
                    {favouriteObjects && favouriteObjects.map((favObject, index) => (
                            <Card shadow="sm" padding="lg" radius="md" withBorder className="card-holder">
                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text  fw={500}>
                                        {favObject.name}
                                    </Text>
                                    <Image
                                        src={
                                            favObject.is_favourite
                                                ? fav_selected
                                                : fav_unselected
                                        }
                                        alt="Favourite"
                                        height={40}
                                        onClick={(e) =>{e.stopPropagation();
                                            handleMarkerPhotoClick(
                                                favObject
                                            )}
                                        }
                                    />
                                </Group>
                                
                                {expandedPopups[favObject.id] ? (
                                    
                                    <Group>
                                        <br/>
                                        <Card.Section component="a"  style={{ textAlign: 'center' }}>
                                        {favObject.files_base64.length > 0 ? (
                                            <CustomCarousel>
                                                {favObject.files_base64.map((image, index) => (
                                                    <Image height={50} key={index} src={`data:image/jpeg;base64,${image}`} alt={`Image ${index}`} />
                                                ))}
                                            </CustomCarousel>
                                        ) : (
                                            <Image radius="md"
                                            src={null}
                                            
                                            style={{ textAlign: 'center' }}
                                            fallbackSrc="https://placehold.co/600x400?text=Placeholder"/>
                                        )}
                                        </Card.Section>
                                        <Group style={{ display: 'block' }}>
                                            <Text size="sm" >{favObject.location}</Text> 
                                            <Text size="sm" >{favObject.coordinates.join(' ')}</Text> 
                                            <br/>
                                            <Text fw={500}>
                                                О месте
                                            </Text>   
                                            <br/>
                                            <Text size="sm" c="dimmed">
                                                {favObject.description}
                                            </Text> 
                                        </Group>
                                                           
                                        <Button color="blue" fullWidth mt="md" radius="md" onClick={(e) =>{ e.stopPropagation(); togglePopupExpansion(favObject.id)}}>
                                            Скрыть
                                        </Button>
                                    </Group>
                                    ) : (
                                        <Button color="blue" fullWidth mt="md" radius="md" onClick={(e) =>{ e.stopPropagation(); togglePopupExpansion(favObject.id)}}>
                                        Показать
                                    </Button> 
                                    )}
                            </Card>
                                
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