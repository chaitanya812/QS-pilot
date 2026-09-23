// QuickSeva shared location storage
// Used by Home.jsx and Booking.jsx so both pages use the same GPS/address data.

export const QS_LOCATION_KEY = "qsLocationData";
export const QS_LOCATION_TEXT_KEY = "qsLocation";

/**
 * Convert any value to a safe trimmed string.
 */
const cleanText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

/**
 * Normalize location data before saving or returning it.
 * Supports both the new shared format and common field names used by Booking.
 */
export const normalizeLocation = (data = {}) => {
  const latitude = Number(data.latitude ?? data.lat);
  const longitude = Number(data.longitude ?? data.lng ?? data.lon);

  const normalized = {
    address: cleanText(data.address),

    addressLine1: cleanText(
      data.addressLine1 ?? data.house ?? data.houseNumber
    ),

    addressLine2: cleanText(
      data.addressLine2 ?? data.street ?? data.area
    ),

    landmark: cleanText(data.landmark),

    city: cleanText(
      data.city ?? data.town ?? data.district
    ),

    state: cleanText(data.state),

    postalCode: cleanText(
      data.postalCode ?? data.pincode ?? data.zipcode
    ),

    country: cleanText(data.country),

    latitude: Number.isFinite(latitude) ? latitude : null,

    longitude: Number.isFinite(longitude) ? longitude : null,

    accuracy: Number.isFinite(Number(data.accuracy))
      ? Number(data.accuracy)
      : null,

    source: cleanText(data.source) || "manual",

    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  // Build a readable address if only individual fields are available.
  if (!normalized.address) {
    normalized.address = [
      normalized.addressLine1,
      normalized.addressLine2,
      normalized.landmark
        ? `Landmark: ${normalized.landmark}`
        : "",
      normalized.city,
      normalized.state,
      normalized.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return normalized;
};

/**
 * Save the shared location.
 *
 * Also saves qsLocation for compatibility
 * with the existing Home page.
 */
export const saveSharedLocation = (data) => {
  const location = normalizeLocation(data);

  try {
    localStorage.setItem(
      QS_LOCATION_KEY,
      JSON.stringify(location)
    );

    if (location.address) {
      localStorage.setItem(
        QS_LOCATION_TEXT_KEY,
        location.address
      );
    }
  } catch (error) {
    console.error(
      "QuickSeva: Unable to save shared location",
      error
    );
  }

  return location;
};

/**
 * Read the shared location from localStorage.
 */
export const getSharedLocation = () => {
  try {
    const saved = localStorage.getItem(QS_LOCATION_KEY);

    if (saved) {
      return normalizeLocation(JSON.parse(saved));
    }

    // Backward compatibility with the old qsLocation-only setup.
    const oldLocation = localStorage.getItem(
      QS_LOCATION_TEXT_KEY
    );

    if (oldLocation) {
      return normalizeLocation({
        address: oldLocation,
        source: "manual",
      });
    }
  } catch (error) {
    console.error(
      "QuickSeva: Unable to read shared location",
      error
    );
  }

  return null;
};

// Legacy compatibility aliases used by older pages.
export const getSavedLocation = () => getSharedLocation();
export const saveLocation = (data) => saveSharedLocation(data);
export const clearLocation = () => clearSharedLocation();

/**
 * Remove the saved shared location.
 */
export const clearSharedLocation = () => {
  try {
    localStorage.removeItem(QS_LOCATION_KEY);
    localStorage.removeItem(QS_LOCATION_TEXT_KEY);
  } catch (error) {
    console.error(
      "QuickSeva: Unable to clear shared location",
      error
    );
  }
};

/**
 * Check whether usable GPS coordinates exist.
 */
export const hasGpsLocation = (location) => {
  return (
    Number.isFinite(Number(location?.latitude)) &&
    Number.isFinite(Number(location?.longitude))
  );
};

/**
 * Create a Google Maps URL from saved GPS coordinates.
 */
export const getGoogleMapsUrl = (location) => {
  if (!hasGpsLocation(location)) {
    return "";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${location.latitude},${location.longitude}`
  )}`;
};

export default {
  QS_LOCATION_KEY,
  QS_LOCATION_TEXT_KEY,
  normalizeLocation,
  saveSharedLocation,
  saveLocation,
  getSharedLocation,
  getSavedLocation,
  clearSharedLocation,
  clearLocation,
  hasGpsLocation,
  getGoogleMapsUrl,
};