// QuickSeva shared location service
// Home.jsx and Booking.jsx use this single file so the same
// location can be shared across the whole app.

export const QS_LOCATION_KEY = "qsLocationData";
export const QS_LOCATION_TEXT_KEY = "qsLocation";
export const QS_LOCATION_EVENT = "quickseva-location-updated";

const cleanText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const finiteNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const normalizeLocation = (data = {}) => {
  const latitude = finiteNumberOrNull(data.latitude ?? data.lat);
  const longitude = finiteNumberOrNull(
    data.longitude ?? data.lng ?? data.lon
  );

  const normalized = {
    address: cleanText(data.address),
    shortAddress: cleanText(data.shortAddress),

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

    latitude,
    longitude,

    accuracy: finiteNumberOrNull(data.accuracy),

    source: cleanText(data.source) || "manual",

    reverseGeocodeFailed: Boolean(
      data.reverseGeocodeFailed
    ),

    updatedAt:
      data.updatedAt || new Date().toISOString(),
  };

  // Build readable address when individual fields exist.
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

  // Build a shorter display address.
  if (!normalized.shortAddress) {
    normalized.shortAddress = [
      normalized.addressLine2,
      normalized.city,
    ]
      .filter(Boolean)
      .join(", ");

    if (!normalized.shortAddress) {
      normalized.shortAddress = normalized.address;
    }
  }

  return normalized;
};

// Notify Home / Booking when location changes.
const notifyLocationChanged = (location) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(QS_LOCATION_EVENT, {
      detail: location,
    })
  );
};

// ======================================================
// SAVE LOCATION
// ======================================================

export const saveLocation = (data) => {
  const location = normalizeLocation(data);

  try {
    localStorage.setItem(
      QS_LOCATION_KEY,
      JSON.stringify(location)
    );

    // Keep the old key for compatibility.
    if (location.address) {
      localStorage.setItem(
        QS_LOCATION_TEXT_KEY,
        location.address
      );
    }
  } catch (error) {
    console.error(
      "QuickSeva: Unable to save location",
      error
    );
  }

  notifyLocationChanged(location);

  return location;
};

// New shared API name.
export const saveSharedLocation = saveLocation;

// ======================================================
// GET SAVED LOCATION
// ======================================================

export const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem(
      QS_LOCATION_KEY
    );

    if (saved) {
      return normalizeLocation(
        JSON.parse(saved)
      );
    }

    // Backward compatibility with old qsLocation.
    const oldLocation = localStorage.getItem(
      QS_LOCATION_TEXT_KEY
    );

    if (oldLocation) {
      return normalizeLocation({
        address: oldLocation,
        shortAddress: oldLocation,
        addressLine1: oldLocation,
        source: "manual",
      });
    }
  } catch (error) {
    console.error(
      "QuickSeva: Unable to read saved location",
      error
    );
  }

  return null;
};

// New shared API name.
export const getSharedLocation = getSavedLocation;

// ======================================================
// LOCATION SUBSCRIPTION
// ======================================================

export const subscribeToLocation = (callback) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (event) => {
    callback(
      event?.detail || getSavedLocation()
    );
  };

  const handleStorage = (event) => {
    if (
      event.key === QS_LOCATION_KEY ||
      event.key === QS_LOCATION_TEXT_KEY
    ) {
      callback(getSavedLocation());
    }
  };

  window.addEventListener(
    QS_LOCATION_EVENT,
    handleCustomEvent
  );

  window.addEventListener(
    "storage",
    handleStorage
  );

  return () => {
    window.removeEventListener(
      QS_LOCATION_EVENT,
      handleCustomEvent
    );

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };
};

// ======================================================
// GPS
// ======================================================

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      const error = new Error(
        "Geolocation is not supported by this browser."
      );

      error.code = 2;

      reject(error);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
};

// ======================================================
// REVERSE GEOCODING
// GPS COORDINATES → ADDRESS
// ======================================================

const reverseGeocode = async (
  latitude,
  longitude
) => {
  const url = new URL(
    "https://nominatim.openstreetmap.org/reverse"
  );

  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "lat",
    latitude
  );

  url.searchParams.set(
    "lon",
    longitude
  );

  url.searchParams.set(
    "zoom",
    "18"
  );

  url.searchParams.set(
    "addressdetails",
    "1"
  );

  const response = await fetch(
    url.toString(),
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Reverse geocoding failed: ${response.status}`
    );
  }

  return response.json();
};

// ======================================================
// DETECT GPS + SAVE ADDRESS
// ======================================================

export const detectAndSaveCurrentLocation =
  async () => {
    // First get GPS coordinates.
    const position =
      await getCurrentPosition();

    const {
      latitude,
      longitude,
      accuracy,
    } = position.coords;

    // Save GPS immediately.
    // Even if address lookup fails,
    // Booking still has coordinates.
    let saved = saveLocation({
      latitude,
      longitude,
      accuracy,
      source: "gps",
      reverseGeocodeFailed: true,
    });

    try {
      // Convert GPS coordinates into address.
      const data =
        await reverseGeocode(
          latitude,
          longitude
        );

      const address =
        data?.address || {};

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        "";

      const state =
        address.state || "";

      const postalCode =
        address.postcode || "";

      const area =
        address.suburb ||
        address.neighbourhood ||
        address.residential ||
        address.quarter ||
        "";

      const houseNumber =
        address.house_number || "";

      const road =
        address.road || "";

      const addressLine1 =
        [
          houseNumber,
          road,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

      saved = saveLocation({
        address:
          data?.display_name || "",

        shortAddress:
          [
            area,
            city,
          ]
            .filter(Boolean)
            .join(", "),

        addressLine1,

        addressLine2:
          area,

        landmark: "",

        city,

        state,

        postalCode,

        country:
          address.country || "",

        latitude,

        longitude,

        accuracy,

        source: "gps",

        reverseGeocodeFailed:
          false,
      });

      return saved;
    } catch (error) {
      console.warn(
        "QuickSeva: GPS detected but reverse geocoding failed.",
        error
      );

      return {
        ...saved,
        reverseGeocodeFailed: true,
      };
    }
  };

// ======================================================
// CLEAR LOCATION
// ======================================================

export const clearSavedLocation = () => {
  try {
    localStorage.removeItem(
      QS_LOCATION_KEY
    );

    localStorage.removeItem(
      QS_LOCATION_TEXT_KEY
    );
  } catch (error) {
    console.error(
      "QuickSeva: Unable to clear location",
      error
    );
  }

  notifyLocationChanged(null);
};

export const clearSharedLocation =
  clearSavedLocation;

// ======================================================
// GPS CHECK
// ======================================================

export const hasGpsLocation = (
  location
) => {
  return (
    Number.isFinite(
      Number(location?.latitude)
    ) &&
    Number.isFinite(
      Number(location?.longitude)
    )
  );
};

// ======================================================
// GOOGLE MAPS URL
// ======================================================

export const getGoogleMapsUrl = (
  location
) => {
  if (
    !hasGpsLocation(location)
  ) {
    return "";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${location.latitude},${location.longitude}`
  )}`;
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  QS_LOCATION_KEY,
  QS_LOCATION_TEXT_KEY,
  QS_LOCATION_EVENT,

  normalizeLocation,

  saveLocation,
  saveSharedLocation,

  getSavedLocation,
  getSharedLocation,

  subscribeToLocation,

  detectAndSaveCurrentLocation,

  clearSavedLocation,
  clearSharedLocation,

  hasGpsLocation,

  getGoogleMapsUrl,
};