/**
 * Geolocation Utilities
 * Provides browser-based geolocation services using the Geolocation API
 */

/**
 * Get user's current location using browser Geolocation API
 * 
 * @param {Object} options - Geolocation options
 * @param {boolean} options.enableHighAccuracy - Use GPS if available (default: true)
 * @param {number} options.timeout - Timeout in milliseconds (default: 10000)
 * @param {number} options.maximumAge - Maximum age of cached position (default: 0)
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 * @throws {Error} If geolocation fails or is not supported
 */
export async function getCurrentLocation(options = {}) {
    const defaultOptions = {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0 // Don't use cached location
    };

    const geolocationOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser. Please use a modern browser.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy // Accuracy in meters
                });
            },
            (error) => {
                let errorMessage = 'Failed to get your location';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable. Please check your device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while getting your location.';
                }
                
                reject(new Error(errorMessage));
            },
            geolocationOptions
        );
    });
}

/**
 * Check if geolocation is supported by the browser
 * 
 * @returns {boolean} True if geolocation is supported
 */
export function isGeolocationSupported() {
    return 'geolocation' in navigator;
}

/**
 * Request location permission without getting the actual location
 * Useful for checking permission status
 * 
 * @returns {Promise<boolean>} True if permission granted
 */
export async function checkLocationPermission() {
    if (!isGeolocationSupported()) {
        return false;
    }

    try {
        // Try to get current position with a short timeout
        await getCurrentLocation({ timeout: 5000 });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Format location error for user display
 * 
 * @param {Error} error - Error from getCurrentLocation
 * @returns {string} User-friendly error message
 */
export function formatLocationError(error) {
    if (!error || !error.message) {
        return 'Failed to get your location. Please try again.';
    }
    return error.message;
}

/**
 * Calculate approximate distance between two coordinates (simple approximation)
 * Note: For accurate calculations, use the backend validation
 * This is just for UI display purposes
 * 
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers (approximate)
 */
export function calculateApproximateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
