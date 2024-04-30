import React, { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import { UserContext } from "../../context/UserContext";
import { Routing } from "leaflet";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import "leaflet/dist/leaflet.css"
import MapTemplate from "../map_template/MapTemplate";
import SearchBox from "../map_template/search_box/SearchBox";
import { Card, Image, Text, Badge, Button, Group, createTheme, MantineProvider, Input, CloseButton, Modal, List, Divider   } from '@mantine/core';
import classes from './Demo.module.css';
import { IconCirclePlus } from '@tabler/icons-react';
import uuid from 'react-uuid';
import { useDebounce } from "@uidotdev/usehooks";


const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};



const CardRoute = ({ updateWaypoints }) => {  
    const [modalOpen, setModalOpen] = useState(false);
    const [newCardContent, setNewCardContent] = useState("");
    const [cards, setCards] = useState([])

    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 300);
    const [routeDisabled, setRouteDisabled] = useState(true);
    
  
    const openModal = () => setModalOpen(true);

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
    console.log("LIST", cards)

    
    const handleCreateRoute = () => {
        const waypoints = cards.map(card => [card.lat, card.lon]);
        updateWaypoints(waypoints);
        console.log("WAYPOINTS", waypoints)
    };
    
    return (
        <div>
        <Group>
            <Card>
            {cards.length === 0 ? (
                    <Text>Локации не заданы</Text>
                ) : (
                    cards.map((card) => (
                        <Card key={card.id} shadow="sm" padding="lg" radius="md" withBorder className="card-holder">
                            <Text fw={500}>{card.content}</Text>   
                            <Button onClick={() => handleDeleteCard(card.id)} style={{ marginLeft: "10px" }}>Удалить</Button>
                        </Card>
                    ))
                )}
            <Button onClick={openModal} >
                Добавить локацию
            </Button>
            <Button disabled={routeDisabled} onClick={handleCreateRoute} style={{ marginTop: "10px", border: "10px" }}>
                 Создать маршрут
            </Button>
            </Card>  
        </Group>
        
        <Modal
          opened={modalOpen}
          onClose={closeModal}
          title="Добавить карточку"
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
      </div>
    );
  };


export default CardRoute