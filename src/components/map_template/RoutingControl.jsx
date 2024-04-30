import React, { useEffect, useRef } from 'react';
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

//53.9024716', '27.5618225' - minsk
//52.093751', '23.6851851' - brest
const createRoutineMachineLayer = ({ position, waypoints, color }) => {
  
  console.log("CREATEROUTE", waypoints)
  const instance = L.Routing.control({
    position,
    waypoints: waypoints,
    // waypoints: [
    //   ['53.9024716','27.5618225'],
    //   ['52.093751','23.6851851'],
    // ],
    lineOptions: {
      styles: [
        {
          color,
        },
      ],
    },
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;