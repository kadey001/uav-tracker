import { getUAVColor } from './color';
import DroneIconA from '../components/icons/DroneIconA.svg?raw';
import DroneIconB from '../components/icons/DroneIconB.svg?raw';
import DroneIconC from '../components/icons/DroneIconC.svg?raw';
import type { UAV } from '@/types';

export const createMarkerElement = (uav: UAV) => {
    const marker = document.createElement('div');
    const getRandomIcon = () => {
        const icons = [DroneIconA, DroneIconB, DroneIconC];
        return icons[Math.floor(Math.random() * icons.length)];
    };
    marker.innerHTML = getRandomIcon();
    const svg = marker.querySelector('svg');
    if (svg) {
        svg.classList.add('w-10', 'h-10', 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]');
        svg.setAttribute('fill', getUAVColor(uav));
    }
    return marker;
};
