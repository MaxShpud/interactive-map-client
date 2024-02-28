import './App.css'
import React, {useContext, useEffect, useState} from "react"
import { UserContext } from './context/UserContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageLogin, PageRegister, PageHome, PageAccount, PageMap } from './components/Pages'

const App = () => {
  const [message, setMessage] = useState("")

  const [userData] = useContext(UserContext)
  const current_theme = localStorage.getItem('current_theme')
    
  const [theme, setTheme] = useState(current_theme? current_theme: 'light')

    useEffect(()=>{
        localStorage.setItem('current_theme', theme)
    }, [theme])

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
    const response = await fetch("/api", requestOptions)
    const data = await response.json()

    if (!response.ok) {
      console.log("something messed up")
    } else {
      setMessage(data.message)
    }
    console.log(data)
  }

  useEffect(() => {
    getWelcomeMessage()
  }, [])
  
  return (
    <BrowserRouter>
        <Routes>
              <Route path="/" element={<PageLogin theme={theme} setTheme={setTheme}/>} />
              <Route path="register" element={<PageRegister theme={theme} setTheme={setTheme}/>} />
              <Route path="home" element={<PageHome theme={theme} setTheme={setTheme}/>} />
              <Route path="account" element={<PageAccount theme={theme} setTheme={setTheme}/>} />
              <Route path="map" element={<PageMap theme={theme} setTheme={setTheme}/>} />
        </Routes>
      </BrowserRouter>
    // <>
    //   <Header title={message}/>
    //   <div className="columns">
    //     <div className="column"></div>
    //     <div className="column m-5 is-two-thirds">
    //       {
    //         !token ? (
    //           <div className="columns">
    //             <Register/>
    //             <Login/>
    //           </div>
    //         ): (
    //           <p>Table</p>
    //         )
    //       }
    //     </div>
    //     <div className="column"></div>
    //   </div>
    // </>
  )
}

export default App
