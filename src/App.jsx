import './App.css'
import React, {useContext, useEffect, useState} from "react"
import { UserContext } from './context/UserContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageLogin, PageRegister, PageHome } from './components/Pages'

const App = () => {
  const [message, setMessage] = useState("")

  const [token] = useContext(UserContext)

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
              <Route path="/" element={<PageLogin />} />
              <Route path="register" element={<PageRegister />} />
              <Route path="home" element={<PageHome/>} />
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
