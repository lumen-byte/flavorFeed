import axios from 'axios';

// CONCEPT: Centralized Location Service
// This abstracts the third-party Geocoding and Autocomplete APIs.
// If we switch from OpenStreetMap to Google Maps later, we ONLY change this file.

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const LocationService = {
    // 1. Search (Autocomplete)
    // Fetches multiple readable locations matching a query
    searchLocations: async (query) => {
        if (!query || query.length < 3) return [];
        try {
            const res = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5
                }
            });
            return res.data; // Array of results with lat, lon, display_name
        } catch (err) {
            console.error("Location search failed", err);
            return [];
        }
    },

    // 2. Reverse Geocode (Lat/Lng -> Text)
    // Used when we hit "Detect My Location" via GPS
    reverseGeocode: async (lat, lng) => {
        try {
            const res = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                    addressdetails: 1
                }
            });
            const data = res.data;
            if (data && data.address) {
                // Return a clean locality name like Swiggy
                return data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || data.display_name;
            }
            return "Unknown Location";
        } catch (err) {
            console.error("Reverse geocode failed", err);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // Fallback
        }
    }
};
