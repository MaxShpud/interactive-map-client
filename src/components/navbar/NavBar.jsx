import React, { useContext, useState, useEffect } from "react";
import "./NavBar.css"
import { UserContext } from "../../context/UserContext"
import { Outlet, useLocation, useNavigate, BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import search_icon_light from '../../assets/search-w.png'
import search_icon_dark from '../../assets/search-b.png'
import toggle_light from '../../assets/night.png'
import toggle_dark from '../../assets/day.png'
import logo_dark from '../../assets/logo_b.png'
import logo_light from '../../assets/logo_w.png'
import logout_dark from '../../assets/logout_b.png'
import logout_light from '../../assets/logout_w.png'
import Account from "../Account";

const NavBar = ({theme, setTheme}) =>{
    const [userData, setUserData] = useContext(UserContext)
    const navigate = useNavigate()
    const toggle_mode = () =>{
        theme == 'light' ? setTheme('dark') : setTheme('light')
    }
    const handleLogout = () => {
        setUserData({ token: null, userRole: null });
        navigate('/', {replace: true})
    }
    return(
        <div className="navbar">
                <img src={theme == 'light' ? logo_light: logo_dark} alt="" className="logo"/>
                <ul>
                    <li onClick={() => navigate('/home', {replace: true})}>Home</li>
                    <li onClick={() => navigate('/map', {replace: true})}>Map</li>
                    <li>Routes</li>
                    <li>Favourites</li>
                    <li onClick={() => navigate('/account', {replace: true})}>Account</li>
                    {userData.userRole === 'ADMIN' && <li>Admin Panel</li>}
                </ul>
                <div className="search-box">
                    <input type="text" placeholder="Search" />
                    <img src={theme == 'light' ? search_icon_light: search_icon_dark} alt="" />
                </div>

                <img onClick={()=>{toggle_mode()}} src={theme == 'light' ? toggle_light: toggle_dark} alt="" className="toggle-icon"/>
                {userData.token && (<img onClick={handleLogout} src={theme == 'light' ? logout_light: logout_dark} alt="" className="logout"/>)}
            </div> 
    )
}

export default NavBar