
import React, { useEffect, useRef } from 'react';
import type { UAV } from '../types';
import DroneIcon from './icons/DroneIconB.svg?raw';
import mapboxgl from 'mapbox-gl';
import { stringToNeonColor } from '../tools';

interface MapProps {
    uavs: UAV[];
    mapboxToken: string;
}

// Custom marker HTML element
const createMarkerElement = (id: string) => {
    const el = document.createElement('div');
    el.innerHTML = DroneIcon; // Use the raw SVG string

    // You can also add classes to the SVG itself
    el.querySelector('svg')?.classList.add(
        'w-8', 'h-8', 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]' 
    );
    el.querySelector('svg')?.setAttribute('fill', stringToNeonColor(id));

    return el;
};

const getPopupHTML = (uav: UAV) => `
    <div class="uav-info">
        <div class="font-bold text-base mb-1">${uav.id}</div>
        <div><strong>Lat:</strong> ${uav.lat.toFixed(6)}</div>
        <div><strong>Lon:</strong> ${uav.lng.toFixed(6)}</div>
        <div><strong>Alt:</strong> ${uav.altitude.toFixed(0)} m</div>
        <div><strong>Bearing:</strong> ${uav.bearing.toFixed(1)}°</div>
    </div>
`;

export const MapComponent = ({ uavs, mapboxToken }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Map<string, { marker: any; popup: any }>>(new Map());

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        mapboxgl.accessToken = mapboxToken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [-122.4194, 37.7749],
            zoom: 12,
            pitch: 45,
            bearing: -17.6,
        });

        map.on('load', () => {
            mapRef.current = map;
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [mapboxToken]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const markers = markersRef.current;
        const currentUavIds = new Set(uavs.map(u => u.id));

        // Remove markers for UAVs that no longer exist
        for (const [id, { marker, popup }] of markers.entries()) {
            if (!currentUavIds.has(id)) {
                marker.remove();
                popup.remove();
                markers.delete(id);
            }
        }

        // Add or update markers for current UAVs
        uavs.forEach(uav => {
            const existing = markers.get(uav.id);
            if (existing) {
                // Update existing marker
                existing.marker.setLngLat([uav.lng, uav.lat]).setRotation(uav.bearing);
                existing.popup.setHTML(getPopupHTML(uav));
            } else {
                // Create new marker
                const el = createMarkerElement(uav.id);
                const popup = new mapboxgl.Popup({ 
                    offset: 25, 
                    closeButton: false,
                    closeOnClick: false 
                }).setHTML(getPopupHTML(uav));
                
                const marker = new mapboxgl.Marker({ element: el, rotationAlignment: 'map' })
                    .setLngLat([uav.lng, uav.lat])
                    .setRotation(uav.bearing)
                    .setPopup(popup)
                    .addTo(map);
                
                // Show popup on hover
                const markerEl = marker.getElement();
                markerEl.addEventListener('mouseenter', () => marker.togglePopup());
                markerEl.addEventListener('mouseleave', () => marker.togglePopup());

                markers.set(uav.id, { marker, popup });
            }
        });
    }, [uavs]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
};
