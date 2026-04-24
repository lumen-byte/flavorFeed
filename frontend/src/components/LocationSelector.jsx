import React, { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';
import { LocationService } from '../services/LocationService';
import '../styles/LocationSelector.css';

const LocationSelector = ({ isOpen, onClose, currentLocation, onRefresh }) => {
    const { setLocationManually } = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 2) {
                setIsSearching(true);
                const data = await LocationService.searchLocations(query);
                setResults(data);
                setIsSearching(false);
            } else {
                setResults([]);
            }
        }, 500); // debounce API calls

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectLocation = (res) => {
        setLocationManually(parseFloat(res.lat), parseFloat(res.lon), res.display_name);
        setQuery('');
        setResults([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay bottom-sheet-overlay" onClick={onClose}>
            <div className="modal-content bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="drag-handle"></div>
                <h3 className="location-title">Select Location</h3>

                <div className="location-search-box">
                    <input
                        type="text"
                        placeholder="Search for area, street name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="location-search-input"
                    />
                </div>

                {query.length > 2 ? (
                    <div className="location-results">
                        {isSearching ? (
                            <div className="location-option"><p>Searching...</p></div>
                        ) : results.length > 0 ? (
                            results.map((res, i) => (
                                <div key={i} className="location-option" onClick={() => handleSelectLocation(res)}>
                                    <div className="loc-icon">📍</div>
                                    <div className="loc-details">
                                        <h4>{res.display_name.split(',')[0]}</h4>
                                        <p>{res.display_name}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="location-option"><p>No results found</p></div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="location-option active">
                            <div className="loc-icon">📌</div>
                            <div className="loc-details">
                                <h4>Selected Location</h4>
                                <p>{currentLocation}</p>
                            </div>
                            <div className="check-icon">✓</div>
                        </div>

                        <div className="location-option" onClick={() => { onRefresh(); onClose(); }}>
                            <div className="loc-icon">🎯</div>
                            <div className="loc-details">
                                <h4>Detect My Location</h4>
                                <p>Refresh using GPS</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LocationSelector;
