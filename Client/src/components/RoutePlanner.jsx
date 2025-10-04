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

const libraries = ["places"];
const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 20.5937, lng: 78.9629 };

export default function RoutePlanner() {
  const [mode, setMode] = useState("PERSONAL");
  const [subMode, setSubMode] = useState("4W");
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

  const getModeIcon = (subMode) => {
    switch (subMode) {
      case "4W":
        return "🚗";
      case "BIKE":
        return "🏍";
      case "BUS":
        return "🚌";
      case "SLEEPER":
        return "🛌";
      case "3AC":
        return "🛫";
      case "CAR_BOOKING":
        return "🚖";
      default:
        return "❓";
    }
  };

  const calculateCost = (distanceMeters, mode, subMode) => {
    const distanceKm = distanceMeters / 1000;
    let baseCost = 0;
    let costPerKm = 0;
    let baseFare = 0;
    let tollCost = 0;

    if (mode === "PERSONAL") {
      if (subMode === "4W") {
        const mileage = 17; // kmpl
        const fuelCostPerLitre = 105; // ₹ per liter
        tollCost = Math.max(50, Math.floor(distanceKm / 60) * 120); // ₹120 every 60km
        baseCost = (distanceKm / mileage) * fuelCostPerLitre + tollCost;
      } else if (subMode === "BIKE") {
        const mileage = 40; // kmpl
        const fuelCostPerLitre = 105; // ₹ per liter
        baseCost = (distanceKm / mileage) * fuelCostPerLitre;
      }
    } else if (mode === "TRANSIT") {
      baseFare = subMode === "BUS" ? 20 : subMode === "SLEEPER" ? 80 : 150;
      costPerKm = subMode === "BUS" ? 2.5 : subMode === "SLEEPER" ? 0.45 : 2.2;
      baseCost = baseFare + (distanceKm * costPerKm);
    } else if (mode === "CAR_BOOKING") {
      baseFare = 80;
      costPerKm = 15;
      tollCost = Math.max(30, Math.floor(distanceKm / 50) * 80);
      baseCost = baseFare + (distanceKm * costPerKm) + tollCost;
    }

    // Add time-based costs for longer journeys
    const timeMultiplier = distanceKm > 200 ? 1.1 : distanceKm > 500 ? 1.2 : 1;
    const finalCost = baseCost * timeMultiplier;

    return {
      minCost: Math.round(finalCost * 0.85),
      maxCost: Math.round(finalCost * 1.15),
      baseCost: Math.round(finalCost),
      tollCost: Math.round(tollCost),
    };
  };
  const fetchRoutes = async (origin, destination) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, travelMode: "DRIVE" }),
      });
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const decodedRoutes = data.routes
          .filter((r) => r.polyline?.encodedPolyline)
          .slice(0, 3)
          .map((r, idx) => ({
            id: idx,
            path: polyline.decode(r.polyline.encodedPolyline).map(([lat, lng]) => ({ lat, lng })),
            distance: r.distanceMeters,
            duration: r.duration,
          }));
        setRoutes(decodedRoutes);
        setMapKey((prev) => prev + 1);

        const firstRoute = decodedRoutes[0];
        if (firstRoute) {
          setOriginLatLng(firstRoute.path[0]);
          setDestinationLatLng(firstRoute.path[firstRoute.path.length - 1]);

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
          onChange={(e) => {
            setMode(e.target.value);
            if (e.target.value === "PERSONAL") setSubMode("4W");
            else if (e.target.value === "TRANSIT") setSubMode("BUS");
            else if (e.target.value === "CAR_BOOKING") setSubMode("CAR_BOOKING");
          }}
        >
          <option value="PERSONAL">Personal Vehicle</option>
          <option value="TRANSIT">Transit</option>
          <option value="CAR_BOOKING">Car Booking</option>
        </select>

        {/* Sub-mode selector */}
        {mode === "PERSONAL" && (
          <select className="border p-2 rounded w-full" value={subMode} onChange={(e) => setSubMode(e.target.value)}>
            <option value="4W">4-Wheeler</option>
            <option value="BIKE">Bike</option>
          </select>
        )}
        {mode === "TRANSIT" && (
          <select className="border p-2 rounded w-full" value={subMode} onChange={(e) => setSubMode(e.target.value)}>
            <option value="BUS">Bus</option>
            <option value="SLEEPER">Train - Sleeper</option>
            <option value="3AC">Train - 3AC</option>
          </select>
        )}

        <button onClick={handleFindRoutes} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Find Routes
        </button>

        <div className="mt-4 flex flex-col gap-2">
          {routes.map((r, idx) => {
            const { minCost, maxCost } = calculateCost(r.distance, mode, subMode);
            return (
              <div
                key={idx}
                onClick={() => setActiveRoute(r.id)}
                className={`p-4 border rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer bg-white ${
                  activeRoute === r.id ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                <p className="font-bold text-sm mb-1">
                  {getModeIcon(subMode)} Route {idx + 1}
                </p>
                <p className="text-sm mb-1">
                  Distance: <span className="font-semibold">{(r.distance / 1000).toFixed(2)} km</span>, Duration:{" "}
                  <span className="font-semibold">{Math.round(parseInt(r.duration) / 60)} mins</span>
                </p>
                <p className="text-sm font-semibold text-green-700">
                  Estimated Cost: ₹{minCost} - ₹{maxCost}
                </p>
              </div>
            );
          })}
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
                strokeWeight: activeRoute === route.id || hoveredRoute === route.id ? 6 : 4,
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
                <p className="font-bold">{getModeIcon(subMode)} Route {hoveredRoute + 1}</p>
                <p>Distance: {(routes[hoveredRoute].distance / 1000).toFixed(2)} km</p>
                <p>Duration: {Math.round(parseInt(routes[hoveredRoute].duration) / 60)} mins</p>
                <p className="font-semibold text-green-700">
                  Cost: ₹{calculateCost(routes[hoveredRoute].distance, mode, subMode).minCost} - ₹
                  {calculateCost(routes[hoveredRoute].distance, mode, subMode).maxCost}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
