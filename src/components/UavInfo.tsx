import { UAV } from "../types";
import { Button } from "./ui/button";

interface UavInfoProps {
    uav: UAV;
    onTrack?: (id: string) => void;
    isTracking?: boolean;
}

export const UavInfo = ({ uav, onTrack, isTracking }: UavInfoProps) => {
    return (
        <div className="uav-info">
            <div className="font-bold text-base mb-1">{uav.id}</div>
            <div><strong>Lat:</strong> {uav.lat.toFixed(6)}</div>
            <div><strong>Lon:</strong> {uav.lng.toFixed(6)}</div>
            <div><strong>Alt:</strong> {uav.altitude.toFixed(0)} m</div>
            <div><strong>Bearing:</strong> {uav.bearing.toFixed(1)}°</div>
            <div><strong>Speed:</strong> {uav.speed} m/s</div>
            <div><strong>Status:</strong> {uav.status} </div>
            <div><strong>Battery:</strong> {uav.battery}%</div>
            <Button className={`mt-2 px-3 py-1 rounded ${isTracking ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`} onClick={() => onTrack?.(uav.id)}>
                {isTracking ? 'Tracking' : 'Track'}
            </Button>
        </div>
    );
};
