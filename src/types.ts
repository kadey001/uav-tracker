import type { Root } from 'react-dom/client';

export type UAVStatus = 'active' | 'inactive' | 'low-battery' | 'warning' | 'error';

export type UAV = {
  id: string;
  lat: number;
  lng: number;
  altitude: number; // in meters
  bearing: number; // in degrees, 0 is North, 90 is East
  speed: number; // in m/s
  battery: number; // in percentage 0-100
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
