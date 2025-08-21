import type { Root } from 'react-dom/client';

export type UAVStatus = 'active' | 'inactive' | 'warning' | 'error';

export type UAV = {
  id: string;
  lat: number;
  lng: number;
  altitude: number; // in meters
  bearing: number; // in degrees, 0 is North, 90 is East
  speed: number; // in m/s
  status?: UAVStatus;
  velocity: {
    vx: number; // change in longitude per tick
    vy: number; // change in latitude per tick
  };
}

export type MarkerInfo = {
    marker: mapboxgl.Marker;
    popup: mapboxgl.Popup;
    popupRoot: Root;
};
