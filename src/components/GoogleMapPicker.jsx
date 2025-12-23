import React, { useEffect, useRef, useState } from "react";

export default function GoogleMapPicker({ onLocationSelect }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [address, setAddress] = useState("Fetching location...");

  // Reverse GeoCode: prefer Google (env VITE_GOOGLE_MAPS_KEY) -> OpenCage (VITE_OPENCAGE_KEY) -> Nominatim
  const getAddress = async (lat, lng) => {
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    const openCageKey = import.meta.env.VITE_OPENCAGE_KEY;

    if (googleKey) {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}`);
        const data = await res.json();
        const result = data.results?.[0];
        const finalAddress = result?.formatted_address || null;
        if (finalAddress) {
          setAddress(finalAddress);
          onLocationSelect({ latitude: lat, longitude: lng, address: finalAddress });
          return;
        }
      } catch (e) {
        // ignore and fallback
      }
    }

    if (openCageKey) {
      try {
        const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${openCageKey}&no_annotations=1&language=en`);
        const data = await res.json();
        const finalAddress = data.results?.[0]?.formatted || null;
        if (finalAddress) {
          setAddress(finalAddress);
          onLocationSelect({ latitude: lat, longitude: lng, address: finalAddress });
          return;
        }
      } catch (e) {
        // ignore and fallback
      }
    }

    // Fallback to Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`;
      const res2 = await fetch(url, { headers: { "User-Agent": "quickly-app/1.0 (contact@yourdomain.com)" } });
      const data2 = await res2.json();
      let finalAddress = data2.display_name || `${lat}, ${lng}`;
      if (data2.address) {
        const a = data2.address;
        const parts = [a.road || a.pedestrian || a.cycleway || a.footway, a.suburb, a.city_district, a.city || a.town || a.village, a.state, a.postcode, a.country].filter(Boolean);
        if (parts.length) finalAddress = parts.join(", ");
      }
      setAddress(finalAddress);
      onLocationSelect({ latitude: lat, longitude: lng, address: finalAddress });
      return;
    } catch (e) {
      setAddress("Address not found");
      onLocationSelect({ latitude: lat, longitude: lng, address: "Address not found" });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!window.google) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 16,
        });

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          draggable: true,
        });

        markerRef.current = marker;

        getAddress(lat, lng);

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          getAddress(position.lat(), position.lng());
        });

        // Autocomplete
        const input = document.getElementById("searchBox");
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          const loc = place.geometry.location;
          map.panTo(loc);
          marker.setPosition(loc);
          getAddress(loc.lat(), loc.lng());
        });
      },
      () => {
        alert("Location permission denied");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div>
      <input
        id="searchBox"
        type="text"
        placeholder="Search location..."
        className="w-full border p-2 rounded mb-2"
      />

      <div
        ref={mapRef}
        style={{ width: "100%", height: "300px", borderRadius: "10px" }}
      />

      <div className="mt-3 p-2 bg-blue-50 border rounded">
        <strong>📍 Selected Location</strong>
        <p className="text-sm">{address}</p>
      </div>
    </div>
  );
}
