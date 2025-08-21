
export type UAV = {
  id: string;
  lat: number;
  lng: number;
  altitude: number; // in meters
  bearing: number; // in degrees, 0 is North, 90 is East
  velocity: {
    vx: number; // change in longitude per tick
    vy: number; // change in latitude per tick
  };
}
