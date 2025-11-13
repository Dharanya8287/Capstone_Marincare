/**
 * Location Utilities
 * Provides geolocation validation and distance calculation for challenges
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * This provides great-circle distance between two points on Earth
 * 
 * @param {number} lat1 - Latitude of point 1 in degrees
 * @param {number} lon1 - Longitude of point 1 in degrees
 * @param {number} lat2 - Latitude of point 2 in degrees
 * @param {number} lon2 - Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Validate if user is within allowed distance from challenge location
 * 
 * @param {Object} userLocation - User's current location
 * @param {number} userLocation.latitude - User's latitude
 * @param {number} userLocation.longitude - User's longitude
 * @param {Object} challengeLocation - Challenge location from MongoDB
 * @param {Array<number>} challengeLocation.coordinates - [longitude, latitude] GeoJSON format
 * @param {number} maxDistanceKm - Maximum allowed distance in kilometers
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether location is valid
 * @returns {number|null} result.distance - Distance in km (null if validation failed)
 * @returns {string} result.message - Human-readable message
 */
export function validateLocation(userLocation, challengeLocation, maxDistanceKm = 5) {
    // Validate user location
    if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number') {
        return {
            isValid: false,
            distance: null,
            message: 'User location not provided or invalid'
        };
    }

    // Validate challenge location
    if (!challengeLocation || !challengeLocation.coordinates || !Array.isArray(challengeLocation.coordinates)) {
        return {
            isValid: false,
            distance: null,
            message: 'Challenge location not available'
        };
    }

    // GeoJSON format is [longitude, latitude]
    const [challengeLng, challengeLat] = challengeLocation.coordinates;
    
    if (typeof challengeLat !== 'number' || typeof challengeLng !== 'number') {
        return {
            isValid: false,
            distance: null,
            message: 'Invalid challenge coordinates'
        };
    }

    // Calculate distance
    const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        challengeLat,
        challengeLng
    );

    const isValid = distance <= maxDistanceKm;
    const distanceRounded = Math.round(distance * 100) / 100; // Round to 2 decimals

    return {
        isValid,
        distance: distanceRounded,
        message: isValid 
            ? `Location verified (${distanceRounded} km from challenge)`
            : `You are too far from the challenge location (${distanceRounded} km away, maximum allowed is ${maxDistanceKm} km)`
    };
}

/**
 * Read environment variable with runtime refresh for testing mode
 * This allows TESTING_MODE to be updated without server restart
 * 
 * @param {string} key - Environment variable key
 * @returns {string|undefined} Environment variable value
 */
function getEnvVariable(key) {
    // For testing-related variables, try to read from .env file in real-time
    if (key === 'TESTING_MODE' || key === 'TESTING_BYPASS_EMAILS') {
        try {
            const envPath = path.resolve(__dirname, '../../.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const lines = envContent.split('\n');
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    // Skip comments and empty lines
                    if (trimmedLine.startsWith('#') || !trimmedLine) continue;
                    // Parse KEY=VALUE
                    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
                    if (match && match[1].trim() === key) {
                        return match[2].trim();
                    }
                }
            }
        } catch (error) {
            // If reading .env file fails, fall back to process.env
            console.warn(`[Location] Failed to read .env file for ${key}, using process.env`);
        }
    }
    
    // Fall back to process.env for all other variables or if .env read failed
    return process.env[key];
}

/**
 * Check if location verification should be bypassed for testing purposes
 * 
 * @param {string} userEmail - User's email address
 * @returns {boolean} Whether to bypass location check
 */
export function shouldBypassLocationCheck(userEmail) {
    // Check if testing mode is enabled globally (with runtime refresh)
    const testingMode = getEnvVariable('TESTING_MODE') === 'true';
    if (testingMode) {
        console.log('[Location] Testing mode enabled - bypassing location check');
        return true;
    }

    // Check if user email is in bypass list (with runtime refresh)
    const bypassEmails = getEnvVariable('TESTING_BYPASS_EMAILS')?.split(',').map(e => e.trim()) || [];
    const shouldBypass = bypassEmails.includes(userEmail);
    
    if (shouldBypass) {
        console.log(`[Location] Email ${userEmail} in bypass list - bypassing location check`);
    }
    
    return shouldBypass;
}

/**
 * Check if location verification is enabled globally
 * 
 * @returns {boolean} Whether location verification is enabled
 */
export function isLocationVerificationEnabled() {
    return process.env.LOCATION_VERIFICATION_ENABLED !== 'false';
}

/**
 * Get maximum allowed distance for location verification
 * 
 * @returns {number} Maximum distance in kilometers
 */
export function getMaxAllowedDistance() {
    const distance = parseFloat(process.env.LOCATION_MAX_DISTANCE_KM || '5');
    return isNaN(distance) ? 5 : distance;
}
