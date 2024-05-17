import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./Scroll.css"
import { Input, Button, List, ListItem, Image, Divider, Text, ThemeIcon } from '@mantine/core';

const ScrollMyRoutes = ({ cardArray }) => {
  const params = new URLSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

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
      return <div>No data available</div>;
    }

    const handleShowOnMap = (items) => {
      const itemsString = JSON.stringify(items);
      console.log("STR", itemsString)
      params.append('items', itemsString);
      // const coordinates = cardArray.map(item => item.coordinates);
      //params.append('item', item);
      const queryString = new URLSearchParams(params).toString();
      //window.location.href = `/routes?${queryString}`;
      //navigate('/map', { replace: true });
  };
    return (
        <div>
          <Text>Мои маршруты</Text>
          <div className="gallery-wrap">
            
            <img src="src/assets/back.png" id="backBtn"/>
            <div className="gallery">
                
              {cardArray.map((item, index) => (
                <div key={index} className="gallery-item">
  
                  <p>Name: {item.name}</p>
                  <p>Description: {item.description}</p>
                  <p>Location: {item.location}</p>
                  <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    type="submit"
                    onClick={ () =>
                      navigate('/routes', {
                      state: item,
                      replace: true
                    })}    
                    >
                    Показать на карте
                    </Button>
                </div>
                
              ))} 
              
          </div>
            <img src="src/assets/next.png" id="nextBtn"/>
          </div>
          
        </div>
        
    )
}

export default ScrollMyRoutes
