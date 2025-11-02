import { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

// Hidden kinds list
const HIDDEN_KINDS = [
  "museums",
  "interesting_places",
  "religion",
  "other_temples",
  "cultural",
];

export default function OpenTripPlaces() {
  const [destLatLng, setDestLatLng] = useState(null);
  const [places, setPlaces] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [radius, setRadius] = useState(5000);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const destAutoRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleSearch = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      alert("Select a valid destination from autocomplete");
      return;
    }

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    setDestLatLng({ lat, lng: lon });
    setSelectedPlace(null);

    const bodyData = {
      destination: { lat, lon },
      kinds: HIDDEN_KINDS.join(","),
      radius: Number(radius),
      limit: 50
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/opentripplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        alert("Unexpected response from server");
        setPlaces([]);
        return;
      }

      const formatted = data
        .map((p) => {
          if (!p.location || !p.address || typeof p.address !== "object") return null;
          const plat = Number(p.location.lat);
          const plon = Number(p.location.lon);
          if (Number.isNaN(plat) || Number.isNaN(plon)) return null;

          const vals = Object.values(p.address).filter(Boolean);
          if (vals.length === 0) return null;

          const address = vals.join(", ");

          return { ...p, location: { lat: plat, lng: plon }, address };
        })
        .filter(Boolean);

      setPlaces(formatted);
      setMapKey((k) => k + 1);

      if (mapRef.current && formatted.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        formatted.forEach((p) => bounds.extend(p.location));
        bounds.extend({ lat, lng: lon });
        mapRef.current.fitBounds(bounds);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setPlaces([]);
    }
  };

  const handleSidebarClick = (place) => {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.panTo(place.location);
      mapRef.current.setZoom(16);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 p-4 border-r overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Top Places to Visit</h2>

        {/* Selected location */}
        {destLatLng && (
          <div className="text-sm text-gray-600 mb-3">
            {destAutoRef.current?.getPlace()?.formatted_address || "Selected Location"}
          </div>
        )}

        {/* Radius Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
        <input
          type="number"
          placeholder="5000"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Autocomplete */}
        <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
          <input
            type="text"
            placeholder="Enter destination (select suggestion)"
            className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>

        <button
          onClick={handleSearch}
          className="w-full py-2 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Find Places
        </button>

        {/* Places List */}
        <div>
          {places.length === 0 && <div className="text-gray-500 text-sm">No places yet</div>}
          {places.map((p, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(p)}
              className={`p-3 mb-2 rounded-md cursor-pointer transition ${
                selectedPlace === p ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold text-gray-800">{p.name}</div>
              <div className="text-sm text-gray-600">{p.address}</div>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="mt-2 w-full rounded-md border"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={destLatLng || defaultCenter}
          zoom={destLatLng ? 12 : 5}
          onLoad={(map) => (mapRef.current = map)}
        >
          {destLatLng && (
            <Marker
              position={destLatLng}
              label={{
                text: `Radius: ${radius} m`,
                fontWeight: "bold",
                fontSize: "12px",
                color: "#1976d2",
              }}
            />
          )}

          {places.map((p, idx) => (
            <Marker
              key={idx}
              position={p.location}
              onClick={() => setSelectedPlace(p)}
              title={p.name}
            />
          ))}

          {selectedPlace && (
  <InfoWindow
    position={selectedPlace.location}
    onCloseClick={() => setSelectedPlace(null)}
  >
    <div className="max-w-xs">
      <strong className="block text-gray-800">{selectedPlace.name}</strong>
      <div className="text-sm text-gray-600">{selectedPlace.address}</div>
      {selectedPlace.image && (
        <img
          src={selectedPlace.image}
          alt={selectedPlace.name}
          className="mt-2 w-full rounded-md"
        />
      )}

      {/* View in Maps button */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        View in Maps
      </a>
    </div>
  </InfoWindow>
)}

        </GoogleMap>
      </div>
    </div>
  );
}
