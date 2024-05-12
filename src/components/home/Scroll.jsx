import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./Scroll.css"
import { Input, Button, List, ListItem, Image, Divider, Text, ThemeIcon } from '@mantine/core';

const Scroll = ({ cardArray }) => {

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
    return (
        <div>
          <Text>Маршруты</Text>
          <div className="gallery-wrap">
            
            <img src="src/assets/back.png" id="backBtn"/>
            <div className="gallery">
                
              {cardArray.map((item, index) => (
                <div key={index} className="gallery-item">
                  {/* <Image radius="md"
                  src={null}
                  
                  style={{ textAlign: 'center' }}
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"/> */}
                  <p>Name: {item.name}</p>
                  <p>Description: {item.description}</p>
                  <p>Location: {item.location}</p>
                </div>
                
              ))} 
          </div>
            <img src="src/assets/next.png" id="nextBtn"/>
          </div>
          
        </div>
        
    )
}

export default Scroll
