import {
  QS_LOCATION_KEY,
  QS_LOCATION_TEXT_KEY,
  normalizeLocation,
  saveSharedLocation,
  getSharedLocation,
  clearSharedLocation,
  hasGpsLocation,
  getGoogleMapsUrl,
} from "./locationStorage.js";

export { QS_LOCATION_KEY, QS_LOCATION_TEXT_KEY, normalizeLocation, hasGpsLocation, getGoogleMapsUrl };

export const getSavedLocation = () => getSharedLocation();

export const saveLocation = (data) => saveSharedLocation(data);

export const clearLocation = () => clearSharedLocation();

export const detectCurrentLocation = async () => {
  if (!navigator || !navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);

        const detected = saveSharedLocation({
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
          source: "gps",
          address: "Current location",
          displayName: "Current location",
        });

        resolve(detected);
      },
      (error) => {
        const message =
          error && error.message
            ? error.message
            : "Unable to detect your current location.";

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

export default {
  QS_LOCATION_KEY,
  QS_LOCATION_TEXT_KEY,
  normalizeLocation,
  getSavedLocation,
  saveLocation,
  clearLocation,
  detectCurrentLocation,
  hasGpsLocation,
  getGoogleMapsUrl,
};
