import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export const INITIAL_CENTER = { lat: 33.690538, lng: -117.915573 }; // LA

const MAPBOX_STYLES = {
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    streets: 'mapbox://styles/mapbox/streets-v12',
    light: 'mapbox://styles/mapbox/light-v10',
    dark: 'mapbox://styles/mapbox/dark-v10',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    standard: 'mapbox://styles/mapbox/standard'
};


interface UseMapProps {
    mapboxToken?: string;
}

export const useMap = ({ mapboxToken = MAPBOX_TOKEN }: UseMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        mapboxgl.accessToken = mapboxToken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAPBOX_STYLES.standard,
            center: [INITIAL_CENTER.lng, INITIAL_CENTER.lat],
            zoom: 10,
            pitch: 0,
            bearing: 0,
        });

        map.on('load', () => {
            mapRef.current = map;
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [mapboxToken]);

    return { mapContainerRef, mapRef }
}