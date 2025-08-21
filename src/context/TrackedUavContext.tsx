import { createContext, useContext, useState, ReactNode } from 'react';

interface TrackedUavContextType {
    trackedUavId: string | null;
    setTrackedUavId: (id: string | null) => void;
}

const TrackedUavContext = createContext<TrackedUavContextType | undefined>(undefined);

export const TrackedUavProvider = ({ children }: { children: ReactNode }) => {
    const [trackedUavId, setTrackedUavId] = useState<string | null>(null);

    const updateTrackedUavId = (id: string | null) => {
        if (trackedUavId === id) {
            setTrackedUavId(null);
        } else {
            setTrackedUavId(id);
        }
    };

    return (
        <TrackedUavContext.Provider value={{ trackedUavId, setTrackedUavId: updateTrackedUavId }}>
            {children}
        </TrackedUavContext.Provider>
    );
};

export const useTrackedUav = () => {
    const context = useContext(TrackedUavContext);
    if (!context) {
        throw new Error('useTrackedUav must be used within a TrackedUavProvider');
    }
    return context;
};
