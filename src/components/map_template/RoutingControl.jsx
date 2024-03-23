import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = ({ position, color }) => {
  const instance = L.Routing.control({
    position,
    waypoints: [
      [53.9, 27.5667],
      [53.6884, 23.8258],
      [52.0975, 23.6877]
    ],
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