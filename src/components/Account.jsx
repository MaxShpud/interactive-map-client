
import "./Account.css"
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import './Home.css'

const Account = ({theme, setTheme}) => {

    const [token] = useContext(UserContext)
    

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('Current location is ', location)
    }, [location])

    if (!token) {
        navigate('/', {replace: true})
    }
    
    
  return (
    <div className={`container ${theme}`}>
        <div className="account-card">
        <h2 className="account-card-title">Account Information</h2>
        <div className="account-info">
            <label>Name:</label>
            <p>John</p>
        </div>
        <div className="account-info">
            <label>Surname:</label>
            <p>Doe</p>
        </div>
        <div className="account-info">
            <label>Email:</label>
            <p>johndoe@example.com</p>
        </div>
        <div className="account-description">
            <label>Description:</label>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="account-info">
            <label>Phone Number:</label>
            <p>123-456-7890</p>
        </div>
        <div className="account-objects">
            <label>Number of Objects:</label>
            <p>5</p>
        </div>
        </div>
    </div>
    
  );
};

export default Account
