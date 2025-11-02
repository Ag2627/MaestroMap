import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import PlacesDisplay from "./PlacesDisplay";

const GOOGLE_TYPES = [
  "museums",
  "art_gallery",
  "cultural",
  "park",
  "tourist_attraction",
  "water_park",
  "stadium",
];

// ✅ static constant for libraries
const LIBRARIES = ["places"];

// Base URL of backend API
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function PlacesFetch() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [places, setPlaces] = useState([]);
  const [destLatLng, setDestLatLng] = useState(null);
  const [radius, setRadius] = useState(5000);
  const destAutoRef = useRef(null);

  const handleSearch = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      alert("Select a valid destination");
      return;
    }

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();
    setDestLatLng({ lat, lng: lon });

    const bodyData = {
      destination: { lat, lon },
      radius: Number(radius),
      types: GOOGLE_TYPES.join(","),
      limit: 100,
    };

    console.log("📡 Sending request:", bodyData);

    try {
      const res = await fetch(`${apiBaseUrl}/trip/googleplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      console.log("✅ Response status:", res.status);
      const data = await res.json();
      console.log("📦 Received:", data);

      if (!Array.isArray(data)) {
        alert("Unexpected server response");
        setPlaces([]);
        return;
      }

      const formatted = data
        .map((p) => {
          if (!p.location || !p.address) return null;
          const plat = Number(p.location.lat);
          const plon = Number(p.location.lng);
          if (Number.isNaN(plat) || Number.isNaN(plon)) return null;
          return { ...p, location: { lat: plat, lng: plon } };
        })
        .filter(Boolean)
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

      setPlaces(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      setPlaces([]);
    }
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Radius (meters)
        </label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        />
        <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
          <input
            type="text"
            placeholder="Enter destination"
            className="w-full p-2 mb-3 border rounded-md"
          />
        </Autocomplete>
        <button
          onClick={handleSearch}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Find Places
        </button>
      </div>

      {/* Display component */}
      <PlacesDisplay places={places} destLatLng={destLatLng} radius={radius} />
    </div>
  );
}
