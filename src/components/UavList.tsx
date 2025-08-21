import React from 'react';
import type { UAV } from '../types';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface UavListProps {
    uavs: UAV[];
    onUavSelect: (uav: UAV) => void;
}

export const UavList = ({ uavs, onUavSelect }: UavListProps) => {
    return (
        <ScrollArea className="h-100 w-65 rounded-md border">
            <h2 className="scroll-m-20 px-2 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 bg-black">UAV List</h2>
            <ul>
                {/* Map through the UAV data and render each item */}
                {uavs.map((uav) => (
                    <Card key={uav.id} onClick={() => onUavSelect(uav)} className={'mx-2 px-4 py-2 border-b border-gray-600'}>
                        {uav.id}
                    </Card>
                ))}
            </ul>
        </ScrollArea>
    );
};
