import { useState, useRef } from "react";
import {
  GoogleMap,
  Polyline,
  useJsApiLoader,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

// Libraries outside component
const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 20.5937, lng: 78.9629 };

export default function RoutePlanner() {
  const [mode, setMode] = useState("DRIVE");
  const [routes, setRoutes] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [originLatLng, setOriginLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);

  const originRef = useRef(null);
  const destRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchRoutes = async (origin, destination) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/trip/find`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin, destination, travelMode: mode }),
        }
      );
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const decodedRoutes = data.routes
          .filter((r) => r.polyline?.encodedPolyline)
          .slice(0, 3)
          .map((r, idx) => ({
            id: idx,
            path: polyline
              .decode(r.polyline.encodedPolyline)
              .map(([lat, lng]) => ({ lat, lng })),
            distance: r.distanceMeters,
            duration: r.duration,
          }));
        setRoutes(decodedRoutes);
        setMapKey((prev) => prev + 1);

        const firstRoute = decodedRoutes[0];
        if (firstRoute) {
          setOriginLatLng(firstRoute.path[0]);
          setDestinationLatLng(
            firstRoute.path[firstRoute.path.length - 1]
          );

          setTimeout(() => {
            if (mapRef.current) {
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(firstRoute.path[0]);
              bounds.extend(firstRoute.path[firstRoute.path.length - 1]);
              mapRef.current.fitBounds(bounds);
            }
          }, 100);
        }
      } else {
        setRoutes([]);
        setOriginLatLng(null);
        setDestinationLatLng(null);
        setMapKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setRoutes([]);
      setOriginLatLng(null);
      setDestinationLatLng(null);
      setMapKey((prev) => prev + 1);
    }
  };

  const handleFindRoutes = () => {
    const origin = originRef.current?.value || "";
    const destination = destRef.current?.value || "";
    if (origin && destination) fetchRoutes(origin, destination);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 flex flex-col gap-2 p-2 border-r overflow-y-auto">
        <Autocomplete>
          <input
            type="text"
            placeholder="Enter Origin"
            ref={originRef}
            className="border p-2 rounded w-full"
          />
        </Autocomplete>
        <Autocomplete>
          <input
            type="text"
            placeholder="Enter Destination"
            ref={destRef}
            className="border p-2 rounded w-full"
          />
        </Autocomplete>
        <select
          className="border p-2 rounded w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="DRIVE">Drive</option>
          <option value="WALK">Walk</option>
          <option value="BICYCLE">Bicycle</option>
          <option value="TRANSIT">Transit</option>
        </select>
        <button
          onClick={handleFindRoutes}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Find Routes
        </button>

        <div className="mt-4 flex flex-col gap-2">
          {routes.map((r, idx) => (
            <div
              key={idx}
              onClick={() => setActiveRoute(r.id)}
              className={`p-2 border rounded shadow-sm hover:bg-gray-50 transition cursor-pointer ${
                activeRoute === r.id ? "bg-blue-100" : ""
              }`}
            >
              <p className="font-bold text-sm">Route {idx + 1}</p>
              <p className="text-sm">
                Distance:{" "}
                <span className="font-semibold">
                  {(r.distance / 1000).toFixed(2)} km
                </span>
                , Duration:{" "}
                <span className="font-semibold">
                  {Math.round(parseInt(r.duration) / 60)} mins
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-3/4 h-full">
        <GoogleMap
          key={mapKey}
          mapContainerStyle={containerStyle}
          center={originLatLng || center}
          zoom={originLatLng ? 10 : 5}
          onLoad={(map) => (mapRef.current = map)}
        >
          {originLatLng && <Marker position={originLatLng} label="O" />}
          {destinationLatLng && <Marker position={destinationLatLng} label="D" />}

          {routes.map((route) => (
            <Polyline
              key={route.id}
              path={[...route.path]}
              options={{
                strokeColor:
                  activeRoute === route.id
                    ? "orange"
                    : hoveredRoute === route.id
                    ? "purple"
                    : route.id === 0
                    ? "blue"
                    : route.id === 1
                    ? "green"
                    : "red",
                strokeOpacity: 0.8,
                strokeWeight:
                  activeRoute === route.id || hoveredRoute === route.id ? 6 : 4,
              }}
              onMouseOver={(e) => {
                setHoveredRoute(route.id);
                setHoverPos(e.latLng);
              }}
              onMouseOut={() => {
                setHoveredRoute(null);
                setHoverPos(null);
              }}
            />
          ))}

          {hoveredRoute !== null && hoverPos && (
            <InfoWindow position={hoverPos}>
              <div className="text-sm">
                <p className="font-bold">Route {hoveredRoute + 1}</p>
                <p>
                  Distance:{" "}
                  {(
                    routes[hoveredRoute].distance / 1000
                  ).toFixed(2)}{" "}
                  km
                </p>
                <p>
                  Duration:{" "}
                  {Math.round(parseInt(routes[hoveredRoute].duration) / 60)}{" "}
                  mins
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
