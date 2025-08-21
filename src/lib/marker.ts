import { getUAVColor } from './color';
import { DroneIcons } from '../components/icons';
import type { UAV } from '@/types';

export const createMarkerElement = (uav: UAV) => {
    const marker = document.createElement('div');
    const getRandomIcon = () => {
        return DroneIcons[Math.floor(Math.random() * DroneIcons.length)];
    };
    marker.innerHTML = getRandomIcon();
    const svg = marker.querySelector('svg');
    if (svg) {
        svg.classList.add('w-10', 'h-10', 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]');
        svg.setAttribute('fill', getUAVColor(uav));
    }
    return marker;
};
