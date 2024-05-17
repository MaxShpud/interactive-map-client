
import "./Account.css"
import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./navbar/NavBar";
import './Home.css'
import { FileButton, Button, Group, Text, Image, Modal, Input, CloseButton, TextInput, Notification, rem  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconX, IconCheck } from '@tabler/icons-react';

const Account = ({theme, setTheme}) => {

    const [accountData, setAccountData] = useState(null)
    const navigate = useNavigate()
    const [userData, setUserData] = useContext(UserContext)
    //const token = localStorage.getItem('mapToken')
    const [editingField, setEditingField] = useState(null)
    const [editedValue, setEditedValue] = useState('')
    const [file, setFile] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [editedValues, setEditedValues] = useState({
        surname: "",//accountData.surname,
        name: "",//accountData.name,
        phone_number: "",//accountData.phone_number,
        about_me: "",//accountData.about_me
    })
    const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/current', {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setAccountData(data);
                    setEditedValues({
                        surname: data.surname || '',
                        name: data.name || '',
                        phone_number: data.phone_number || '',
                        about_me: data.about_me || ''
                    });

                } else {
                    console.error('Failed to fetch user data')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        fetchUserData();
    }, [userData.token])
    
    if (!userData.token) {
        navigate('/', {replace: true})
    }

    const handleEditClick = (field) => {
        setEditingField(field)
        setEditedValue(accountData[field])
    }
    console.log(accountData)

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('file', file)
        try{
            const endpoint = "/api/file/avatar"
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userData.token}`
                },
                body: formData
            }) 
            if (response.ok) {
                const fetchUserData = async () => {
                    try {
                        const response = await fetch('/api/user/current', {
                            headers: {
                                Authorization: `Bearer ${userData.token}`
                            }
                        })
                        if (response.ok) {
                            const data = await response.json()
                            setAccountData(data);
                            setEditedValues({
                                surname: data.surname || '',
                                name: data.name || '',
                                phone_number: data.phone_number || '',
                                about_me: data.about_me || ''
                            });
        
                        } else {
                            console.error('Failed to fetch user data')
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error)
                    }
                }
                await fetchUserData()
                // const updatedAccountData = await fetchUserData();
                // setAccountData(updatedAccountData);
                setEditingField(null)
                setFile(null);
                setSuccessMessage("Фото успешно загружено!")
                  setTimeout(() => {
                    close();
                    setSuccessMessage('');
                  }, 4000);
            }
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(''), 5000);
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
                body: JSON.stringify(editedValues)
            })
            
            if (response.ok) {
                
                const updatedUserData = await response.json()
                setAccountData(updatedUserData)
                setEditingField(null)
                setSuccessMessage("Данные успешно изменены!")
                close();
                  setTimeout(() => {
                    
                    setSuccessMessage('');
                  }, 4000);
            } else {
                console.error('Failed to update user data')
            }
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
        finally{

        }
    };

    if (!accountData) {
        return null
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedValues((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    return (
        
        <div className={`container ${theme}`}>
            <Modal opened={opened} onClose={() => {
              close();
              
                }} title="Изменение данных" 
                >
                    <TextInput label="Фамилия" 
                        placeholder="Введите фамилию" size="md" 
                        name="surname"
                        value={editedValues.surname}
                        onChange={handleInputChange}
                        rightSectionPointerEvents="all"
                        mt="md"
                    />
                    <TextInput label="Имя" 
                        placeholder="Введите Имя" size="md" 
                        name="name"
                        value={editedValues.name}
                        onChange={handleInputChange}
                        rightSectionPointerEvents="all"
                        mt="md"
                    />
                    <TextInput label="Номер телефона" 
                        placeholder="Введите номер телефона" size="md" 
                        name="phone_number"
                        value={editedValues.phone_number}
                        onChange={handleInputChange}
                        rightSectionPointerEvents="all"
                        mt="md"
                    />
                    <TextInput label="О себе" 
                        placeholder="Введите информацию о себе" size="md" 
                        name="about_me"
                        value={editedValues.about_me}
                        onChange={handleInputChange}
                        rightSectionPointerEvents="all"
                        mt="md"
                    />
                    <Button onClick={handleSaveClick} variant="filled" color="orange" style={{ marginTop: "10px", border: "10px" }}>Изменить</Button>
                </Modal>
            <NavBar theme={theme} setTheme={setTheme}/>
            <div className="account-items">
                <div className="account-picture">
                    {accountData.photo_base64 && (
                        <Image src={`data:image/jpeg;base64,${accountData.photo_base64}`} alt="User" />
                    )}
                    <Group justify="center">
                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => <Button  style={{ marginTop: "10px", border: "10px" }} {...props}>Выбрать фото</Button>}
                        </FileButton>
                        {/* <Button disabled={!file} color="red" onClick={clearFile}>
                        Reset
                        </Button> */}
                    </Group>

                    {file && (
                        <Text size="sm" ta="center" mt="sm">
                        Выбранный файл: {file.name}
                        </Text>
                    )}
                    <Button style={{ marginTop: "10px", border: "10px" }} onClick={handleSubmit}>
                        Загрузить
                    </Button>
                    
                </div>
                <div className="account-card">
                    <Text className="account-card-title" size="xl">Личная информация</Text>

                    <Group>
                        <Text size="lg" fw={500}>
                            Email:
                        </Text>
                        <Text>
                            {accountData.email}
                        </Text>
                    </Group>
                    <Group>
                        <Text size="lg" fw={500}>
                            Фамилия:
                        </Text>
                        <Text>
                            {accountData.surname}
                        </Text>
                    </Group>
                    <Group>
                        <Text size="lg" fw={500}>
                            Имя:
                        </Text>
                        <Text>
                            {accountData.name}
                        </Text>
                    </Group>
                    <Group>
                        <Text size="lg" fw={500}>
                            Номер телефона:
                        </Text>
                        <Text>
                            {accountData.phone_number}
                        </Text>
                    </Group>
                    <Group>
                        <Text size="lg" fw={500}>
                            О себе:
                        </Text>
                        <Text>
                            {accountData.about_me}
                        </Text>
                    </Group>
                    
                    {/* <div className="account-info">
                        <label>Email:</label>
                        <p>{accountData.email}</p>
                    </div> */}

                    {/* <div className="account-info">
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
                    </div> */}
                    <Button onClick={open} style={{ marginTop: "10px", border: "10px" }}>Изменить данные</Button>
                    {/* <button onClick={handleSaveClick}>Save</button> */}
                </div>
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
            
        </div>
    );
};

export default Account;