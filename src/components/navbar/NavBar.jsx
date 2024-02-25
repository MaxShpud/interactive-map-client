import React, { useContext, useState, useEffect } from "react";
import "./NavBar.css"
import { Outlet, useLocation, useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import search_icon_light from '../../assets/search-w.png'
import search_icon_dark from '../../assets/search-b.png'
import toggle_light from '../../assets/night.png'
import toggle_dark from '../../assets/day.png'
import logo_dark from '../../assets/logo_b.png'
import logo_light from '../../assets/logo_w.png'

const NavBar = ({theme, setTheme}) =>{
    const toggle_mode = () =>{
        theme == 'light' ? setTheme('dark') : setTheme('light')
    }

    return(
        <div className="navbar">
                <img src={theme == 'light' ? logo_light: logo_dark} alt="" className="logo"/>
                <ul>
                    <li>Home</li>
                    <li>Map</li>
                    <li>Routes</li>
                    <li>Favourites</li>
                    <li>Account</li>
                </ul>
                <div className="search-box">
                    <input type="text" placeholder="Search" />
                    <img src={theme == 'light' ? search_icon_light: search_icon_dark} alt="" />
                </div>

                <img onClick={()=>{toggle_mode()}} src={theme == 'light' ? toggle_light: toggle_dark} alt="" className="toggle-icon"/>

            </div> 
    )
}

export default NavBar