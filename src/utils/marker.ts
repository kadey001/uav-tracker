import { stringToNeonColor } from '.';
import DroneIcon from '../components/icons/DroneIconB.svg?raw';

export const createMarkerElement = (id: string) => {
    const marker = document.createElement('div');
    marker.innerHTML = DroneIcon;
    const svg = marker.querySelector('svg');
    if (svg) {
        svg.classList.add('w-8', 'h-8', 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]');
        svg.setAttribute('fill', stringToNeonColor(id));
    }
    return marker;
};
