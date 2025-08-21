
import React from 'react';
import { useUAVSimulation } from './hooks/useUAVSimulation';
import { MapComponent } from './components/MapComponent';
import { ControlsComponent } from './components/ControlsComponent';

// Public token provided in the prompt
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2FkZXkwMDEiLCJhIjoiY21lZ2tqejdsMWFtZzJsb2g1c2ZnZXpreCJ9.QISelRcjU-dwiBg6eK3QWw';

const App: React.FC = () => {
    const { uavs, setUAVCount, addUAV } = useUAVSimulation(30);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
            <header className="absolute top-0 right-0 z-10 p-4">
                <h1 className="text-2xl font-bold text-white text-shadow" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    Real-time UAV Tracker
                </h1>
            </header>

            <ControlsComponent
                uavCount={uavs.length}
                setUAVCount={setUAVCount}
                addUAV={addUAV}
            />

            <MapComponent 
                uavs={uavs} 
                mapboxToken={MAPBOX_TOKEN} 
            />
        </div>
    );
};

export default App;
