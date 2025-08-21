import { UAV } from "../types";

export const UavInfo = ({ uav }: { uav: UAV }) => {
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
        </div>
    );
};
