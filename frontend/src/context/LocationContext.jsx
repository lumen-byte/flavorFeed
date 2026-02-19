import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null); // { lat, long, address }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Mock address for now since we don't have a reverse geocoding API
                // In a real app, use Google Maps API or OpenStreetMap here
                const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                setLocation({
                    lat: latitude,
                    long: longitude,
                    address: mockAddress // Or "Current Location"
                });
                setLoading(false);
            },
            (err) => {
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, loading, error, fetchLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
