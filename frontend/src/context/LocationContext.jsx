import React, { createContext, useState, useEffect, useContext } from 'react';
import { LocationService } from '../services/LocationService';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null); // { lat, long, address }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const setLocationManually = (lat, long, address) => {
        const newLoc = { lat, long, address };
        setLocation(newLoc);
        localStorage.setItem('userLoc', JSON.stringify(newLoc));
    };

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
                const addressText = await LocationService.reverseGeocode(latitude, longitude);
                setLocationManually(latitude, longitude, addressText);
                setLoading(false);
            },
            (err) => {
                console.error("Geolocation error", err);
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        const savedLoc = localStorage.getItem('userLoc');
        if (savedLoc) {
            try {
                setLocation(JSON.parse(savedLoc));
                setLoading(false);
            } catch (e) {
                fetchLocation();
            }
        } else {
            fetchLocation();
        }
    }, []);

    return (
        <LocationContext.Provider value={{ location, loading, error, fetchLocation, setLocationManually }}>
            {children}
        </LocationContext.Provider>
    );
};
