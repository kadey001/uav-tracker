import type { UAV } from '../types';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface UavListProps {
    uavs: UAV[];
    onUavSelect: (uav: UAV) => void;
    trackedUavId?: string | null;
    setTrackedUavId?: (id: string | null) => void;
}

export const UavList = ({ uavs, onUavSelect, trackedUavId, setTrackedUavId }: UavListProps) => {
    return (
        <ScrollArea className="w-64 max-h-full min-h-0 rounded-md border">
            <h2 className="scroll-m-20 px-2 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 bg-black">UAV List</h2>
            <ul>
                {/* Map through the UAV data and render each item */}
                {uavs.map((uav) => (
                    <Card key={uav.id} onClick={() => onUavSelect(uav)} className={'mx-2 px-4 py-2 border-b border-gray-600'}>
                        {uav.id}
                        <Button className={`px-3 py-1 rounded ${trackedUavId === uav.id ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`} onClick={() => setTrackedUavId && setTrackedUavId(uav.id)}>
                            {trackedUavId === uav.id ? 'Tracking' : 'Track'}
                        </Button>
                    </Card>
                ))}
            </ul>
        </ScrollArea>
    );
};
