import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import type { UAV, MarkerInfo } from '../types';
import { useMap } from '../hooks/useMap';
import { createMarkerElement } from '../lib/marker';
import { UavInfo } from './UavInfo';
import { useTrackedUav } from '../context/TrackedUavContext';

interface MapProps {
    uavs: UAV[];
    mapboxToken: string;
}

export const MapComponent = ({ uavs, mapboxToken }: MapProps) => {
    const { mapContainerRef, mapRef } = useMap({ mapboxToken });
    const markersRef = useRef<Map<string, MarkerInfo>>(new Map());
    const { trackedUavId, setTrackedUavId } = useTrackedUav();
    const [activePopups, setActivePopups] = useState<Set<string>>(new Set());
    const activePopupsRef = useRef(activePopups);

    useEffect(() => {
        activePopupsRef.current = activePopups;
    }, [activePopups]);

    const togglePopup = (id: string) => {
        setActivePopups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const markers = markersRef.current;
        const currentUavIds = new Set(uavs.map(u => u.id));

        // Remove markers for UAVs that no longer exist
        for (const [id, { marker, popup, popupRoot }] of markers.entries()) {
            if (!currentUavIds.has(id)) {
                popupRoot.unmount();
                marker.remove();
                popup.remove();
                markers.delete(id);
            }
        }

        let zIndexCounter = 10;

        uavs.forEach(uav => {
            const existing = markers.get(uav.id);
            const UAVInfo = <UavInfo uav={uav} onTrack={setTrackedUavId} isTracking={trackedUavId === uav.id} />;
            if (existing) {
                // Update existing marker
                existing.marker.setLngLat([uav.lng, uav.lat]).setRotation(uav.bearing);
                existing.popupRoot.render(UAVInfo);
            } else {
                // Create new marker
                const el = createMarkerElement(uav);
                const popupNode = document.createElement('div');
                const popupRoot = createRoot(popupNode);
                popupRoot.render(UAVInfo);

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

                const markerEl = marker.getElement();
                markerEl.addEventListener('click', () => {
                    marker.togglePopup();
                    togglePopup(uav.id);
                });
                markerEl.addEventListener('mouseenter', () => {
                    if (!activePopupsRef.current.has(uav.id)) {
                        marker.togglePopup();
                    }
                    // Ensures whatever marker the cursor is over has the highest z-index popup
                    popup.getElement().style.zIndex = String(zIndexCounter++);
                });
                markerEl.addEventListener('mouseleave', () => {
                    if (!activePopupsRef.current.has(uav.id)) {
                        marker.togglePopup();
                    }
                });

                markers.set(uav.id, { marker, popup, popupRoot });
            }
        });
    }, [uavs, mapRef, activePopups]);

    // Center map on tracked UAV
    useEffect(() => {
        if (!mapRef.current || !trackedUavId) return;
        const uav = uavs.find(u => u.id === trackedUavId);
        if (uav) {
            mapRef.current.flyTo({
                center: [uav.lng, uav.lat],
                speed: 1.2,
                essential: true,
            });
        }
    }, [trackedUavId, uavs, mapRef]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
};