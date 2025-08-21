
import { useState, useEffect, useCallback } from 'react';
import { UAV } from '../types';

// Constants for simulation
const SIMULATION_TICK_MS = 100;
const INITIAL_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const SPAWN_RADIUS = 1; // in degrees
const VELOCITY_SCALE = 0.001;
const VELOCITY_PERTURBATION = 0.00001;
const HEADING_UPDATE_INTERVAL = 5000; // 5 seconds in milliseconds

export const useUAVSimulation = (initialCount: number = 3) => {
  const [uavs, setUavs] = useState<UAV[]>([]);

  const createUAV = useCallback((): UAV => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * SPAWN_RADIUS;
    return {
      id: `UAV-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lat: INITIAL_CENTER.lat + radius * Math.sin(angle),
      lng: INITIAL_CENTER.lng + radius * Math.cos(angle),
      altitude: 100 + Math.random() * 50,
      bearing: Math.random() * 360,
      velocity: {
        vy: (Math.random() - 0.5) * VELOCITY_SCALE,
        vx: (Math.random() - 0.5) * VELOCITY_SCALE,
      },
    };
  }, []);

  const setUAVCount = useCallback((count: number) => {
    setUavs(Array.from({ length: count }, createUAV));
  }, [createUAV]);

  const addUAV = useCallback(() => {
    setUavs(prev => [...prev, createUAV()]);
  }, [createUAV]);

  useEffect(() => {
    setUAVCount(initialCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUavs(prevUavs =>
        prevUavs.map(uav => {
          // Perturb velocity for more "natural" random movement
          let newVx = uav.velocity.vx + (Math.random() - 0.5) * VELOCITY_PERTURBATION;
          let newVy = uav.velocity.vy + (Math.random() - 0.5) * VELOCITY_PERTURBATION;

          let newLng = uav.lng + newVx;
          let newLat = uav.lat + newVy;
          
          // Simple boundary reflection
          if (Math.abs(newLat - INITIAL_CENTER.lat) > SPAWN_RADIUS * 2) {
            newVy = -newVy;
            newLat = uav.lat + newVy;
          }
          if (Math.abs(newLng - INITIAL_CENTER.lng) > SPAWN_RADIUS * 2) {
            newVx = -newVx;
            newLng = uav.lng + newVx;
          }

          // Convert velocity vector to bearing in degrees
          const newBearing = (Math.atan2(newVx, newVy) * 180) / Math.PI;

          return {
            ...uav,
            lat: newLat,
            lng: newLng,
            altitude: Math.max(50, uav.altitude + (Math.random() - 0.5) * 2), // Keep altitude reasonable
            bearing: newBearing,
            velocity: { vx: newVx, vy: newVy },
          };
        })
      );
    }, SIMULATION_TICK_MS);

    return () => clearInterval(intervalId);
  }, []);

  return { uavs, setUAVCount, addUAV };
};
