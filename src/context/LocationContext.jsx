import React, { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = (props) => {

  const [locationData, setLocationData] = useState({
    location: localStorage.getItem("location")
  });
  localStorage.setItem("location", props);
  
  return (
    <LocationContext.Provider value={[locationData, setLocationData]} >
      {props}
    </LocationContext.Provider>
  );
};