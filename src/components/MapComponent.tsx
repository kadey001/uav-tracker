// src/components/MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import type { UAV, MarkerInfo } from '../types';
import { useMap } from '../hooks/useMap';
import { createMarkerElement } from '../utils/marker';
import { UavInfo } from './UavInfo'; // Import the new component

interface MapProps {
    uavs: UAV[];
    mapboxToken: string;
}

export const MapComponent = ({ uavs, mapboxToken }: MapProps) => {
    const { mapContainerRef, mapRef } = useMap({ mapboxToken });
    const markersRef = useRef<Map<string, MarkerInfo>>(new Map());

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const markers = markersRef.current;
        const currentUavIds = new Set(uavs.map(u => u.id));

        // Remove markers for UAVs that no longer exist
        for (const [id, { marker, popup, popupRoot }] of markers.entries()) {
            if (!currentUavIds.has(id)) {
                popupRoot.unmount(); // Unmount the React component
                marker.remove();
                popup.remove();
                markers.delete(id);
            }
        }

        // Add or update markers for current UAVs
        uavs.forEach(uav => {
            const existing = markers.get(uav.id);
            if (existing) {
                // Update existing marker and its React-powered popup
                existing.marker.setLngLat([uav.lng, uav.lat]).setRotation(uav.bearing);
                existing.popupRoot.render(<UavInfo uav={uav} />);
            } else {
                // Create new marker with a React-powered popup
                const el = createMarkerElement(uav.id);
                const popupNode = document.createElement('div');
                const popupRoot = createRoot(popupNode);
                popupRoot.render(<UavInfo uav={uav} />);

                const popup = new mapboxgl.Popup({
                    offset: 25,
                    closeButton: false,
                    closeOnClick: false
                }).setDOMContent(popupNode); // Use setDOMContent

                const marker = new mapboxgl.Marker({ element: el, rotationAlignment: 'map' })
                    .setLngLat([uav.lng, uav.lat])
                    .setRotation(uav.bearing)
                    .setPopup(popup)
                    .addTo(map);
                
                // Show popup on hover
                const markerEl = marker.getElement();
                markerEl.addEventListener('mouseenter', () => marker.togglePopup());
                markerEl.addEventListener('mouseleave', () => marker.togglePopup());

                markers.set(uav.id, { marker, popup, popupRoot });
            }
        });
    }, [uavs, mapRef]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
};