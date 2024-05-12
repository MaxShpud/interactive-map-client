import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./Scroll.css"
import { Input, Button, List, ListItem, Image, Divider, Text, ThemeIcon } from '@mantine/core';


const ScrollObjects = ({ cardArray }) => {
    const navigate = useNavigate()
    const params = new URLSearchParams();
    useEffect(() => {
      if (cardArray && cardArray.length){
        const scrollContainer = document.querySelector(".gallery");
        const backBtn = document.getElementById("backBtn")
        const nextBtn = document.getElementById("nextBtn")
  
        const handleWheel = (event) => {
          event.preventDefault();
          scrollContainer.scrollLeft += event.deltaY;
        };
    
        const handleBackBtn = (event) => {
          scrollContainer.scrollLeft -= 900
        }
        const handleNextBtn = (event) => {
          scrollContainer.scrollLeft += 900
        }
        scrollContainer.addEventListener("wheel", handleWheel);
        backBtn.addEventListener("click", handleBackBtn)
        nextBtn.addEventListener("click", handleNextBtn)
        return () => {
          scrollContainer.removeEventListener("wheel", handleWheel);
        };
      }
      
    }, [cardArray]);

    if (!cardArray || !cardArray.length) {
      return <div>Данные недоступны</div>;
    }

    const handleShowOnMap = (coordinates, name) => {
        
        // const coordinates = cardArray.map(item => item.coordinates);
        params.append('lat', coordinates[0]);
        params.append('lon', coordinates[1]);
        params.append('name', name)
        const queryString = new URLSearchParams(params).toString();
        window.location.href = `/map?${queryString}`;
        //navigate('/map', { replace: true });
    };
    return (
        <div>
          <Text>Достопримечательности</Text>
          <div className="gallery-wrap">
            
            <img src="src/assets/back.png" id="backBtn"/>
            <div className="gallery">
                
              {cardArray.map((item, index) => (
                <div key={index} className="gallery-item">
                  <img src={`src/assets/${index + 1}.jpg`} alt={`Image ${index + 1}`} />
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>{item.location}</p>
                  <p>{item.coordinates[0]} --- {item.coordinates[1]}</p>
                  <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    type="submit"
                    onClick={() => handleShowOnMap(item.coordinates, item.name)}     
                    >
                    Показать на карте
                    </Button>
                </div>
                
              ))}
              
                      {/* <List component="nav" aria-label="main mailbox folders">
                    {cardArray.map((item) => (
                      <div key={item} style={{ paddingBlockStart: "10px" }}>
                        
                          <Text>{item}</Text> 
                        <Divider/>
                      </div>
                    ))}
                  </List> */}   
          </div>
            <img src="src/assets/next.png" id="nextBtn"/>
          </div>
          
        </div>
        
    )
}

export default ScrollObjects
