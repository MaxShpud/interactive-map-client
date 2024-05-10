import React, { useEffect, useRef } from 'react';
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

//53.9024716', '27.5618225' - minsk
//52.093751', '23.6851851' - brest
const createRoutineMachineLayer = (props) => { //{ position, waypoints, color, setCreatedRoute }
  const { position, waypoints, color, setCreatedRoute } = props
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
  instance.on('routeselected', function(e) {
    var route = e.route
    setCreatedRoute(route.summary.totalDistance/1000)
 })

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;