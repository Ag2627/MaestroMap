import React, { useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

export default function PlacesDisplay({ places, destLatLng, radius }) {
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = React.useState(null);

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.panTo(place.location);
      mapRef.current.setZoom(16);
    }
  };

  return (
    <div className="flex-1 flex">
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
              onClick={() => handleMarkerClick(p)}
              title={p.name}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="max-w-xs">
                <strong>{selectedPlace.name}</strong>
                <div className="text-sm text-gray-600">{selectedPlace.address}</div>
                <div className="text-sm text-yellow-600">
                  ⭐ {selectedPlace.rating || "N/A"} ({selectedPlace.reviews || 0})
                </div>
                {selectedPlace.photo && (
                  <img
                    src={selectedPlace.photo}
                    alt={selectedPlace.name}
                    className="mt-2 w-full rounded-md"
                  />
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedPlace.address
                  )}`}
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

      {/* Sidebar list */}
      <div className="w-80 p-4 border-l overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Places List</h2>
        {places.length === 0 ? (
          <div className="text-gray-500 text-sm">No places yet</div>
        ) : (
          places.map((p, i) => (
            <div
              key={i}
              onClick={() => handleMarkerClick(p)}
              className={`p-3 mb-2 rounded-md cursor-pointer ${
                selectedPlace === p ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.address}</div>
              <div className="text-sm text-yellow-600">
                ⭐ {p.rating || "N/A"} ({p.reviews || 0})
              </div>
              {p.photo && (
                <img src={p.photo} alt={p.name} className="mt-2 w-full rounded-md" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
