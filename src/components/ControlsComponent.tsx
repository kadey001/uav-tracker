
import React, { useEffect, useState } from 'react';
import { PlusIcon, MinusIcon } from './icons';
import { Button } from './ui/button';
import { UavList } from './UavList';
import { UAV } from '@/types';

interface ControlsProps {
    uavCount: number;
    setUAVCount: (count: number) => void;
    addUAV: () => void;
    removeUAV: (id?: string) => void;
    uavs: UAV[];
}

export const ControlsComponent = ({ uavCount, setUAVCount, addUAV, removeUAV, uavs }: ControlsProps) => {
    const [numInput, setNumInput] = useState<number>(uavCount);

    const handleSetCount = (e: React.FormEvent) => {
        e.preventDefault();
        if (numInput >= 0) {
            setUAVCount(numInput);
        }
    };

    // Sync local input state with prop changes
    useEffect(() => {
        setNumInput(uavCount);
    }, [uavCount]);

    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl p-4 w-64 text-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">UAV Controls</h2>

                <div className="mb-4">
                    <p className="text-sm text-gray-400">ACTIVE DRONES</p>
                    <p className="text-3xl font-semibold">{uavCount}</p>
                </div>

                <form onSubmit={handleSetCount} className="space-y-2 mb-4">
                    <label htmlFor="uav-count" className="block text-sm font-medium text-gray-400">Set Drone Count</label>
                    <div className="flex gap-2">
                        <input
                            id="uav-count"
                            type="number"
                            min="0"
                            value={numInput}
                            onChange={(e) => setNumInput(parseInt(e.target.value))}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-semibold">
                            Set
                        </button>
                    </div>
                </form>
                <div className="flex flex-col gap-2">
                    <Button variant="success" onClick={addUAV}>
                        <PlusIcon className="w-5 h-5" />
                        <span>Add a UAV</span>
                    </Button>

                    <Button variant="destructive" onClick={() => removeUAV()}>
                        <MinusIcon className="w-5 h-5" />
                        <span>Remove a UAV</span>
                    </Button>
                </div>
            </div>
            <UavList
                uavs={uavs}
                onUavSelect={(uav) => {
                    // Handle UAV selection
                    console.log(`Selected UAV: ${uav.id}`);
                }}
            />
        </div>
    );
};
