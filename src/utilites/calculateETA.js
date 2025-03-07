import { getDistance } from "geolib";

const AVERAGE_SPEED = 50; 

export const calculateETA = (nurseLocation, clientLocation) => {
    if (!nurseLocation || !clientLocation) return "Unknown";

    const distance = getDistance(
        { latitude: nurseLocation.lat, longitude: nurseLocation.lng },
        { latitude: clientLocation.lat, longitude: clientLocation.lng }
    );

    const distanceInKm = distance / 1000;
    const estimatedTime = (distanceInKm / AVERAGE_SPEED) * 60; 

    return `${Math.ceil(estimatedTime)} minutes`;
};
