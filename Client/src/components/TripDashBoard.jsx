import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { fetchRoutes, calculateCost, getModeIcon } from "./tripUtils";

const libraries = ["places"];

export default function TripDashboard() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [routes, setRoutes] = useState([]);
  const [mode, setMode] = useState("PERSONAL");
  const [subMode, setSubMode] = useState("4W");

  const originAutoRef = useRef(null); // Autocomplete instance
  const destAutoRef = useRef(null);   // Autocomplete instance
  const originInputRef = useRef(null); // <input>
  const destInputRef = useRef(null);   // <input>

  const handlePlanTrip = async () => {
    if (!originAutoRef.current || !destAutoRef.current) return;

    const originPlace = originAutoRef.current.getPlace();
    const destPlace = destAutoRef.current.getPlace();

    const origin = originPlace?.formatted_address || originInputRef.current.value;
    const destination = destPlace?.formatted_address || destInputRef.current.value;

    if (!origin || !destination) return;

    const fetchedRoutes = await fetchRoutes(origin, destination);
    setRoutes(fetchedRoutes);
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="flex flex-col gap-2 p-4 w-1/2">
      {/* Origin */}
      <Autocomplete onLoad={(auto) => (originAutoRef.current = auto)}>
        <input
          ref={originInputRef}
          placeholder="Origin"
          className="border p-2 rounded w-full"
        />
      </Autocomplete>

      {/* Destination */}
      <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
        <input
          ref={destInputRef}
          placeholder="Destination"
          className="border p-2 rounded w-full"
        />
      </Autocomplete>

      {/* Mode selection */}
      <select
        value={mode}
        onChange={(e) => {
          const val = e.target.value;
          setMode(val);
          if (val === "PERSONAL") setSubMode("4W");
          else if (val === "TRANSIT") setSubMode("BUS");
          else if (val === "CAR_BOOKING") setSubMode("CAR_BOOKING");
        }}
        className="border p-2 rounded w-full"
      >
        <option value="PERSONAL">Personal</option>
        <option value="TRANSIT">Transit</option>
        <option value="CAR_BOOKING">Car Booking</option>
      </select>

      {/* SubMode selection */}
      {mode === "PERSONAL" && (
        <select
          value={subMode}
          onChange={(e) => setSubMode(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="4W">4-Wheeler</option>
          <option value="BIKE">Bike</option>
        </select>
      )}

      {mode === "TRANSIT" && (
        <select
          value={subMode}
          onChange={(e) => setSubMode(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="BUS">Bus</option>
          <option value="SLEEPER">Train - Sleeper</option>
          <option value="3AC">Train - 3AC</option>
        </select>
      )}

      {mode === "CAR_BOOKING" && (
        <select
          value={subMode}
          onChange={(e) => setSubMode(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="CAR_BOOKING">Car Booking</option>
        </select>
      )}

      <button
        onClick={handlePlanTrip}
        className="bg-blue-500 text-white p-2 rounded w-full mt-2"
      >
        Find Routes
      </button>

      {/* Routes list */}
      <div className="mt-4 flex flex-col gap-2">
        {routes.length === 0 && <p>No routes found.</p>}
        {routes.map((r) => {
          const { minCost, maxCost } = calculateCost(r.distance, mode, subMode);
          return (
            <div key={r.id} className="p-2 border rounded">
              <p>{getModeIcon(subMode)} Route {r.id + 1}</p>
              <p>
                Distance: {(r.distance / 1000).toFixed(2)} km, Duration: {Math.round(r.duration / 60)} mins
              </p>
              <p>Cost: ₹{minCost} - ₹{maxCost}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
