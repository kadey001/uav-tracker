
import React, { useState } from 'react';
import { PlusIcon, CogIcon } from './icons';

interface ControlsProps {
    uavCount: number;
    setUAVCount: (count: number) => void;
    addUAV: () => void;
}

export const ControlsComponent: React.FC<ControlsProps> = ({ uavCount, setUAVCount, addUAV }) => {
    const [numInput, setNumInput] = useState<string>('3');
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

    const handleSetCount = (e: React.FormEvent) => {
        e.preventDefault();
        const count = parseInt(numInput, 10);
        if (!isNaN(count) && count >= 0) {
            setUAVCount(count);
        }
    };

    return (
        <>
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="p-3 bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-full text-gray-200 hover:bg-gray-700/80 transition-colors shadow-lg"
                    aria-label="Toggle controls"
                >
                    <CogIcon className="w-6 h-6" />
                </button>
                
                {isPanelOpen && (
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
                                    onChange={(e) => setNumInput(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                                />
                                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-semibold">
                                    Set
                                </button>
                            </div>
                        </form>
                        
                        <button
                            onClick={addUAV}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Add One UAV</span>
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};
