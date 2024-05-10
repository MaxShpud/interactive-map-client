import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Routing } from "leaflet";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import "leaflet/dist/leaflet.css"
import MapTemplate from "../map_template/MapTemplate";
import SearchBox from "../map_template/search_box/SearchBox";
import { Card, Image, Text, Badge, Button, Group, createTheme, MantineProvider, Input, CloseButton, Modal, List, Divider, TextInput, Notification,
  rem,
  LoadingOverlay,
   } from '@mantine/core';
import classes from './Demo.module.css';

import { IconCirclePlus } from '@tabler/icons-react';
import uuid from 'react-uuid';
//import { useDebouncedCallback } from '@mantine/hooks';
import { useDebounce } from "@uidotdev/usehooks";
import { useDisclosure } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconX, IconCheck } from '@tabler/icons-react';




const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};



const CardRoute = ({ updateWaypoints, createdLength  }) => {  
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
    const [modalOpen, setModalOpen] = useState(false);
    const [newCardContent, setNewCardContent] = useState("");
    const [cards, setCards] = useState([])

    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 300);
    const [routeDisabled, setRouteDisabled] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [isRouteDisplayed, setIsRouteDisplayed] = useState(false);
    const [routeDistance, setRouteDistance] = useState('');
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [createdRoute, setCreatedRoute] = useState({
      name: "",
      length: "",
      location: "",
      description: "",
      type: "HIKING",
      system: false,
    })
    const [userData, setUserData] = useContext(UserContext)
    const [objects, setObjects] = useState([])

  
    const openModal = () => setModalOpen(true);

    console.log("Create Route", createdLength)
    const closeModal = () => {
      setModalOpen(false);
      setNewCardContent("");
    };
  
    const handleChange = (event) => {
        setSearchText(event.target.value);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setSearchText(formData.get("search"));
      };
    
      useEffect(() => {
        setCreatedRoute((prevData) => ({
          ...prevData,
          length: createdLength,
        }));
      }, [createdLength, setCreatedRoute])

      useEffect(() => {
        const fetchData = async () => {
          if (debouncedSearchText) {
            setIsSearching(true);
            const queryParams = {
              q: debouncedSearchText,
              format: "json",
              addressdetails: 1,
              polygon_geojson: 0,
            };
            const queryString = new URLSearchParams(queryParams).toString();
            try {
              const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`);
              const data = await response.json();
              setListPlace(data);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
            setIsSearching(false);
          } else {
            setListPlace([]);
          }
        };
    
        fetchData();
    }, [debouncedSearchText]);

    const handlePlaceSelect = (place) => {
        const newCard = {
          id: uuid(),
          name: place.display_name,
          lon: place.lon,
          lat: place.lat, 
          content: `${place.display_name} (lon: ${place.lon}, lat: ${place.lat})`
        };
        const newObject = {
          "name" : place.display_name,
          "longitude": place.lon,
          "latitude": place.lat,
          "type": "USER_OBJECT"
        }
        setObjects([...objects, newObject])
        setCards([...cards, newCard]);
        closeModal();
      };
  
    const handleDeleteCard = (id) => {
        setCards(cards.filter(card => card.id !== id));
      };

    useEffect(() => {
        if (cards.length >= 2) {
            setRouteDisabled(false);
        } else {
            setRouteDisabled(true);
        }
    }, [cards]);

    
    const handleCreateRoute = () => {
        const waypoints = cards.map(card => [card.lat, card.lon]);
        updateWaypoints(waypoints);
        setIsRouteDisplayed(true);
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCreatedRoute((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit1 = async () => {
      
          try {
            console.log("TRA", {"route": createdRoute, "objects" : objects})
            const requestOptions = {
              method: "POST",
              headers: {"Content-Type": "application/json", Authorization: `Bearer ${userData.token}`},
              body: JSON.stringify({route: createdRoute, objects : objects
              })
          };
          const response = await fetch("/api/route/user", requestOptions);
          const data = await response.json();
        
            if (response.ok) {  
              setSuccessMessage("Маршрут успешно создан!")
                  setTimeout(() => {
                    setSuccessMessage('');
                  }, 4000);
            } else {
                console.error('Failed')
            }
        } catch (error) {
          setErrorMessage(error.message);
          setTimeout(() => setErrorMessage(''), 5000);
        }
        finally{
          setCreatedRoute({
            name: "",
            length: "",
            location: "",
            description: "",
            type: "HIKING",
            system: false,
          }); closeModal();
          setObjects([]);
        }
        
    }

    
    return (
        <div>
          <Modal opened={opened} onClose={() => {
              close();
              setCreatedRoute({
                name: "",
                length: "",
                location: "",
                description: "",
                type: "HIKING",
                system: false,
              });
                }} title="Создание записи" 
                >
                  <TextInput
                label="Название"
                placeholder="Введите название"
                name="name"
                value={createdRoute.name}
                onChange={handleInputChange}
                mt="sm"
                required
              />
              <TextInput
                label="Локация"
                placeholder="Введите локацию"
                name="location"
                value={createdRoute.location}
                onChange={handleInputChange}
                mt="sm"
                required
              />
              <TextInput
                label="Описание"
                placeholder="Введите описание"
                name="description"
                value={createdRoute.description}
                onChange={handleInputChange}
                mt="sm"
              />
            <Button onClick={handleSubmit1} variant="filled" color="teal">Создать</Button>
          </Modal>
        <Group>
        <Card>
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;

              const newCards = Array.from(cards);
              const [removed] = newCards.splice(result.source.index, 1);
              newCards.splice(result.destination.index, 0, removed);

              setCards(newCards);
            }}
          >
            <Droppable droppableId="cards">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            className="card-holder"
                          >
                            <Text fw={500}>{card.content}</Text>
                            <Button
                              onClick={() => handleDeleteCard(card.id)}
                              style={{ marginLeft: "10px" }}
                              color="rgba(252, 151, 151, 1)"
                            >
                              Удалить
                            </Button>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={openModal}>Добавить локацию</Button>
          <Button
            disabled={routeDisabled}
            onClick={handleCreateRoute}
            style={{ marginTop: "10px", border: "10px" }}
          >
            Отобразить маршрут
          </Button>
          <Button
            disabled={!isRouteDisplayed || routeDisabled}
            onClick={open}
            style={{ marginTop: "10px", border: "10px" }}
            color="teal"
          >
            Создать маршрут (добавить в избранное)
          </Button>
        </Card>
      </Group>
        
        <Modal
          opened={modalOpen}
          onClose={closeModal}
          title="Добавить локацию"
          size="sm"
          transitionProps={{ transition: 'rotate-left' }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex" }}>
                <Input
                style={{ flex: 1, marginRight: "10px" }}
                name="search"
                value={searchText}
                onChange={handleChange}
                />
                <Button
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                type="submit"
                disabled={isSearching}
                >
                {isSearching ? "Searching..." : "Search"}
                </Button>
            </div>
          </form>
          <div>
            <List component="nav" aria-label="main mailbox folders">
            {listPlace.map((item) => (
                <div key={item?.place_id} style={{ paddingBlockStart: "10px" }}>
                <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    onClick={() => {
                        handlePlaceSelect(item)
                        setSearchText('');
                    }}
                >
                    <Text>{item?.display_name}</Text> 
                </Button>
                <Divider/>
                </div>
            ))}
            </List>
        </div>
        </Modal>
        {errorMessage && <Notification icon={xIcon} 
                color="red" withBorder  title="Ошибка!" 
                style={{ position: 'fixed', top: '20px', right: '20px' }} 
                >
                    {errorMessage}
                </Notification>}
                {successMessage && <Notification icon={checkIcon} 
                color="green" withBorder title="Успех!"
                 style={{ position: 'fixed', top: '20px', right: '20px' }} 
                 >
                    {successMessage}
                </Notification>}
      </div>
    );
  };


export default CardRoute