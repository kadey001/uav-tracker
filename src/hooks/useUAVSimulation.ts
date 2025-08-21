import { useState, useEffect, useCallback } from 'react';
import type { UAV, UAVStatus } from '../types';
import { INITIAL_CENTER } from '../hooks/useMap';

// Constants for realistic speed calculation ---
const MIN_SPEED_MPS = 5;
const MAX_SPEED_MPS = 250;
const METERS_PER_DEGREE_LAT = 111132; // Approx. meters in 1 degree of latitude

// Constants for simulation
const SIMULATION_TICK_MS = 100;
const TICK_SECONDS = SIMULATION_TICK_MS / 1000;
const SPAWN_RADIUS = 1; // in degrees
const BEARING_PERTURBATION = 10.0; // Max degrees to change direction per second

export const useUAVSimulation = (initialCount: number = 30) => {
  const [uavs, setUavs] = useState<UAV[]>([]);

  const createUAV = useCallback((): UAV => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * SPAWN_RADIUS;

    // --- Generate a random speed and bearing ---
    const speedMPS = MIN_SPEED_MPS + Math.random() * (MAX_SPEED_MPS - MIN_SPEED_MPS);
    const bearing = Math.random() * 360;
    const bearingRad = bearing * (Math.PI / 180);

    // Convert speed from m/s to degrees/tick
    const speedMetersPerTick = speedMPS * TICK_SECONDS;
    const speedDegreesPerTick = speedMetersPerTick / METERS_PER_DEGREE_LAT;

    // Calculate initial velocity vector from speed and bearing
    // Bearing 0 is North, so vy is cos and vx is sin
    const vx = speedDegreesPerTick * Math.sin(bearingRad);
    const vy = speedDegreesPerTick * Math.cos(bearingRad);

    const potentialStatus: Array<UAVStatus> = ['active', 'inactive', 'low-battery', 'error', 'warning'];
    let status = potentialStatus[Math.floor(Math.random() * potentialStatus.length)] as UAV['status'];

    const battery = Math.floor(Math.random() * 101); // Random battery level between 0 and 100
    if (battery === 0) status = 'inactive'; // If battery is 0, set status to inactive
    else if (battery < 20) status = 'low-battery'; // If battery is below 20%, set status to low-battery
    else {
      if (status === 'low-battery') status = 'active';
    }

    return {
      id: `UAV-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lat: INITIAL_CENTER.lat + radius * Math.sin(angle),
      lng: INITIAL_CENTER.lng + radius * Math.cos(angle),
      altitude: 100 + Math.random() * 50,
      bearing,
      speed: speedMPS, // Store the overall speed
      velocity: { vx, vy },
      status,
      battery,
    };
  }, []);

  const setUAVCount = useCallback((count: number) => {
    setUavs(Array.from({ length: count }, createUAV));
  }, [createUAV]);

  const addUAV = useCallback(() => {
    setUavs(prev => [...prev, createUAV()]);
  }, [createUAV]);

  const removeUAV = useCallback((id?: string) => {
    // Defaults to removing the last drone
    setUavs(prev => {
      if (id) {
        return prev.filter(uav => uav.id !== id);
      }
      return prev.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    setUAVCount(initialCount !== 0 ? initialCount : 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUavs(prevUavs =>
        prevUavs.map(uav => {
          if (uav.status === 'inactive') {
            // If the UAV is inactive, we can assume it is stationary at its current position
            return {
              ...uav,
              speed: 0,
              velocity: { vx: 0, vy: 0 },
              altitude: 0,
            };
          }
          // 1. Perturb the bearing for more natural turning
          const bearingChange = (Math.random() - 0.5) * BEARING_PERTURBATION * TICK_SECONDS;
          const newBearing = (uav.bearing + bearingChange + 360) % 360;
          const newBearingRad = newBearing * (Math.PI / 180);

          // 2. Perturb speed slightly but keep it within the defined min/max
          let newSpeedMPS = uav.speed + (Math.random() - 0.5) * 0.5; // Fluctuate by max +/- 0.25 m/s
          newSpeedMPS = Math.max(MIN_SPEED_MPS, Math.min(MAX_SPEED_MPS, newSpeedMPS));

          // 3. Recalculate velocity vector from the new speed and bearing
          const speedMetersPerTick = newSpeedMPS * TICK_SECONDS;
          const speedDegreesPerTick = speedMetersPerTick / METERS_PER_DEGREE_LAT;
          let newVx = speedDegreesPerTick * Math.sin(newBearingRad);
          let newVy = speedDegreesPerTick * Math.cos(newBearingRad);

          // 4. Update position
          let newLng = uav.lng + newVx;
          let newLat = uav.lat + newVy;

          // 5. Simple boundary reflection (reflects the velocity component)
          // TODO: Make boundary optional
          if (Math.abs(newLat - INITIAL_CENTER.lat) > SPAWN_RADIUS * 2) {
            newVy = -newVy;
            newLat = uav.lat + newVy; // Re-calculate position with reflected velocity
          }

          if (Math.abs(newLng - INITIAL_CENTER.lng) > SPAWN_RADIUS * 2) {
            newVx = -newVx;
            newLng = uav.lng + newVx; // Re-calculate position with reflected velocity
          }
          
          // After potential reflection, recalculate bearing from the final vector
          const finalBearing = (Math.atan2(newVx, newVy) * 180 / Math.PI + 360) % 360;

          return {
            ...uav,
            lat: newLat,
            lng: newLng,
            altitude: Math.max(50, uav.altitude + (Math.random() - 0.5) * 2),
            bearing: finalBearing,
            speed: newSpeedMPS, // Update the speed
            velocity: { vx: newVx, vy: newVy },
          };
        })
      );
    }, SIMULATION_TICK_MS);

    return () => clearInterval(intervalId);
  }, []);

  return { uavs, setUAVCount, addUAV, removeUAV };
};