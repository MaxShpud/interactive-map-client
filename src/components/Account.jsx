
import "./Account.css"
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import './Home.css'

const Account = ({theme, setTheme}) => {

    const [accountData, setAccountData] = useState(null)
    const navigate = useNavigate()
    const [userData, setUserData] = useContext(UserContext)
    //const token = localStorage.getItem('mapToken')
    const [editingField, setEditingField] = useState(null)
    const [editedValue, setEditedValue] = useState('')
    const [avatarUser, setAvatarUser] = useState(null)

    useEffect(() => {
        
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/current', {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setAccountData(data);
                } else {
                    console.error('Failed to fetch user data')
                    // navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        fetchUserData();
    }, [userData.token, navigate, setAccountData])

    console.log("TOKEN", userData.token)
    console.log("ACC", accountData)
    if (!userData.token) {
        navigate('/', {replace: true})
    }

    const handleEditClick = (field) => {
        setEditingField(field)
        setEditedValue(accountData[field])
    }

    const handleFileInputChange = (event) => {
        setAvatarUser(event.target.files[0])
    }

    const handleSubmit = async (event) => {
        

        const formData = new FormData()
        formData.append('file', avatarUser)
        try{
            const endpoint = "/api/file/avatar"
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userData.token}`
                },
                body: formData
            }) 
            console.log("Response status:", response.status);
            if (response.ok) {
                
                const updatedUserData = await response.json()
                setAccountData(updatedUserData)
                setEditingField(null)
                
            } else {
                console.error('Failed to update user data')
            }
        } catch (error) {
            console.error('Error updating user data:', error)
        }
    }
    const handleSaveClick = async () => {
        try {
            const response = await fetch(`/api/user?user_id=${accountData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userData.token}`
                },
                body: JSON.stringify({ [editingField]: editedValue })
            })
            
            if (response.ok) {
                
                const updatedUserData = await response.json()
                setAccountData(updatedUserData)
                setEditingField(null)
                
            } else {
                console.error('Failed to update user data')
            }
        } catch (error) {
            console.error('Error updating user data:', error)
        }
    };

    if (!accountData) {
        return null
    }
    return (
        
        <div className={`container ${theme}`}>
            <NavBar theme={theme} setTheme={setTheme}/>
            <div className="account-items">
                <div className="account-picture">
                    {accountData.photo_base64 && (
                        <img src={`data:image/jpeg;base64,${accountData.photo_base64}`} alt="User" />
                    )}
                    <div className="uploadSection">
                        <h2>Update the photo</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="file-upload">
                                <input type="file" onChange={handleFileInputChange}/>
                            </div>
                            
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                </div>
                <div className="account-card">
                    <h2 className="account-card-title">Account Information</h2>
                    <div className="account-info">
                        <label>Email:</label>
                        <p>{accountData.email}</p>
                    </div>
                    <div className="account-info">
                        <label>Name:</label>
                        {editingField === 'name' ? (
                            <input
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                        ) : (
                            <>
                                <p>{accountData.name}</p>
                                <span onClick={() => handleEditClick('name')}>Edit</span>
                            </>
                        )}
                    </div>
                    <div className="account-info">
                        <label>Surname:</label>
                        {editingField === 'surname' ? (
                            <input
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                        ) : (
                            <>
                                {accountData.surname ? (
                                    <>
                                        <p>{accountData.surname}</p>
                                        <span onClick={() => handleEditClick('surname')}>Edit</span>
                                    </>
                                ) : (
                                    <>
                                        <p></p>
                                        <span onClick={() => handleEditClick('surname')}>Add</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="account-info">
                        <label>Phone:</label>
                        {editingField === 'phone_number' ? (
                            <input
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                        ) : (
                            <>
                                {accountData.phone_number ? (
                                    <>
                                        <p>{accountData.phone_number}</p>
                                        <span onClick={() => handleEditClick('phone_number')}>Edit</span>
                                    </>
                                ) : (
                                    <>
                                        <p></p>
                                        <span onClick={() => handleEditClick('phone_number')}>Add</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="account-info">
                        <label>About me:</label>
                        {editingField === 'about_me' ? (
                            <input
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                        ) : (
                            <>
                                {accountData.about_me ? (
                                    <>
                                        <p>{accountData.about_me}</p>
                                        <span onClick={() => handleEditClick('about_me')}>Edit</span>
                                    </>
                                ) : (
                                    <>
                                        <p></p>
                                        <span onClick={() => handleEditClick('about_me')}>Add</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    
                    <button onClick={handleSaveClick}>Save</button>
                </div>
            </div>
            
        </div>
    );
};

export default Account;