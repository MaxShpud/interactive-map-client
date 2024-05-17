import React, { useContext, useState, useEffect } from "react";
import './Home.css'
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import Map from "./map/Map";
import Scroll from "./home/Scroll";
import ScrollObjects from "./home/ScrollObjects";
import ScrollMyRoutes from "./home/ScrollMyRoutes";

const Home = ({theme, setTheme}) => {
    const [userData] = useContext(UserContext)
    const [routesData, setRoutesData] = useState(null)
    const [objectsData, setObjectsData] = useState(null)
    const [routesMyData, setRoutesMyData] = useState(null)
    //const [userRole] = useContext(UserContext)
    const location = useLocation()
    //const navigate = useNavigate()

    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    // if (!userData.token) {
    //     navigate('/', {replace: true})
    // }


    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("/api/routes", {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRoutesData(data.routes);
                    
                } else {
                    console.error('Failed to fetch objects data');
                } 
            } catch (error) {
                console.error("Error fetching markers:", error);
            }
        };

        fetchMarkers();
    }, [setRoutesData]);

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
                    setObjectsData(data.objects);
                    
                } else {
                    console.error('Failed to fetch objects data');
                } 
            } catch (error) {
                console.error("Error fetching markers:", error);
            }
        };

        fetchMarkers();
    }, [setObjectsData]);


    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("/api/routes/user", {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRoutesMyData(data.routes);
                    
                } else {
                    console.error('Failed to fetch objects data');
                } 
            } catch (error) {
                console.error("Error fetching markers:", error);
            }
        };

        fetchMarkers();
    }, [setRoutesMyData]);

    return (
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
            {/* //<HorizontalCardList cards={cards} /> { />/* Вставьте горизонтальный список карточек */}
            <ScrollObjects cardArray={objectsData}/>
            <Scroll cardArray={routesData} />
            <ScrollMyRoutes cardArray={routesMyData} />
            <></>
            {/*<Images/> */}
        </div>
    )
}

export default Home