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
const center = { lat: 20.5937, lng: 78.9629 }; // India Center

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
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);


  const originRef = useRef(null);
  const destRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  
  // Helper function to format duration from seconds to a readable string
  const formatDuration = (durationString) => {
    const seconds = parseInt(durationString.slice(0, -1)); // Remove 's' and parse
    if (isNaN(seconds)) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const getModeIcon = (subMode) => {
    switch (subMode) {
      case "4W": return "🚗";
      case "BIKE": return "🏍️";
      case "BUS": return "🚌";
      case "SLEEPER": return "🚆";
      case "3AC": return "🚆";
      case "CAR_BOOKING": return "🚖";
      default: return "❓";
    }
  };

  const calculateCost = (distanceMeters, mode, subMode) => {
    const distanceKm = distanceMeters / 1000;
    let baseCost = 0, costPerKm = 0, baseFare = 0, tollCost = 0;

    if (mode === "PERSONAL") {
      const fuelCost = 105;
      if (subMode === "4W") {
        tollCost = Math.max(50, Math.floor(distanceKm / 60) * 120);
        baseCost = (distanceKm / 17) * fuelCost + tollCost;
      } else {
        baseCost = (distanceKm / 40) * fuelCost;
      }
    } else if (mode === "TRANSIT") {
        baseFare = subMode === "BUS" ? 20 : (subMode === "SLEEPER" ? 80 : 150);
        costPerKm = subMode === "BUS" ? 2.5 : (subMode === "SLEEPER" ? 0.45 : 2.2);
        baseCost = baseFare + (distanceKm * costPerKm);
    } else if (mode === "CAR_BOOKING") {
        tollCost = Math.max(30, Math.floor(distanceKm / 50) * 80);
        baseCost = 80 + (distanceKm * 15) + tollCost;
    }

    const timeMultiplier = distanceKm > 500 ? 1.2 : distanceKm > 200 ? 1.1 : 1;
    const finalCost = baseCost * timeMultiplier;
    return {
      minCost: Math.round(finalCost * 0.85),
      maxCost: Math.round(finalCost * 1.15),
    };
  };

  const fetchRoutes = async (origin, destination) => {
    setIsLoadingRoutes(true);
    setRoutes([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, travelMode: "DRIVE" }),
      });
      const data = await res.json();

      if (data.routes?.length > 0) {
        const decodedRoutes = data.routes.filter(r => r.polyline?.encodedPolyline).slice(0, 3).map((r, idx) => ({
          id: idx,
          path: polyline.decode(r.polyline.encodedPolyline).map(([lat, lng]) => ({ lat, lng })),
          distance: r.distanceMeters,
          duration: r.duration,
        }));
        setRoutes(decodedRoutes);
        
        const firstRoute = decodedRoutes[0];
        setOriginLatLng(firstRoute.path[0]);
        setDestinationLatLng(firstRoute.path[firstRoute.path.length - 1]);
        
        setTimeout(() => {
          if (mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            decodedRoutes.forEach(route => route.path.forEach(p => bounds.extend(p)));
            mapRef.current.fitBounds(bounds);
          }
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRoutes(false);
      setMapKey(prev => prev + 1); // Refresh map
    }
  };

  const handleFindRoutes = () => {
    const origin = originRef.current?.value || "";
    const destination = destRef.current?.value || "";
    if (origin && destination) fetchRoutes(origin, destination);
    else alert("Please enter both origin and destination.");
  };

  const inputStyle = "w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 hover:border-orange-400 transition-colors duration-200";

  if (!isLoaded) return <div className="flex justify-center items-center h-screen font-bold text-orange-600">Loading Maps...</div>;

  return (
    <div className="flex h-screen bg-orange-50 p-4 gap-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-y-auto">
        <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Route Planner
            </h1>
            <p className="text-sm text-gray-600">Find the best route for your journey.</p>
        </div>

        <div className="space-y-4 flex-grow">
            <div className="space-y-2">
                <label className="font-medium text-gray-700">📍 Origin</label>
                <Autocomplete><input type="text" placeholder="Enter Origin" ref={originRef} className={inputStyle} /></Autocomplete>
            </div>
            <div className="space-y-2">
                <label className="font-medium text-gray-700">🏁 Destination</label>
                <Autocomplete><input type="text" placeholder="Enter Destination" ref={destRef} className={inputStyle} /></Autocomplete>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="font-medium text-gray-700">Mode</label>
                    <select className={inputStyle} value={mode} onChange={(e) => {
                        setMode(e.target.value);
                        if (e.target.value === "PERSONAL") setSubMode("4W");
                        else if (e.target.value === "TRANSIT") setSubMode("BUS");
                        else if (e.target.value === "CAR_BOOKING") setSubMode("CAR_BOOKING");
                    }}>
                        <option value="PERSONAL">Personal</option>
                        <option value="TRANSIT">Transit</option>
                        <option value="CAR_BOOKING">Booking</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="font-medium text-gray-700">Vehicle</label>
                    {mode === "PERSONAL" && <select className={inputStyle} value={subMode} onChange={e => setSubMode(e.target.value)}>
                        <option value="4W">4-Wheeler</option>
                        <option value="BIKE">Bike</option>
                    </select>}
                    {mode === "TRANSIT" && <select className={inputStyle} value={subMode} onChange={e => setSubMode(e.target.value)}>
                        <option value="BUS">Bus</option>
                        <option value="SLEEPER">Train (Sleeper)</option>
                        <option value="3AC">Train (3AC)</option>
                    </select>}
                    {mode === "CAR_BOOKING" && <select className={inputStyle} disabled><option>Car</option></select>}
                </div>
            </div>
             <button
              onClick={handleFindRoutes}
              disabled={isLoadingRoutes}
              className="w-full mt-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:transform-none"
            >
              {isLoadingRoutes ? "⏳ Finding..." : "Find Routes"}
            </button>
        </div>
        
        <div className="mt-4 flex flex-col gap-3">
          {routes.map((r, idx) => {
            const { minCost, maxCost } = calculateCost(r.distance, mode, subMode);
            return (
              <div
                key={idx}
                onClick={() => setActiveRoute(r.id)}
                className={`p-4 border rounded-xl shadow-md bg-white transform transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  activeRoute === r.id ? "ring-2 ring-orange-400 border-orange-400" : "border-orange-200"
                }`}
              >
                <p className="font-bold text-md mb-1">{getModeIcon(subMode)} Route {idx + 1}</p>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><b>Distance:</b> {(r.distance / 1000).toFixed(1)} km</p>
                    <p><b>Duration:</b> {formatDuration(r.duration)}</p>
                    <p className="font-semibold text-green-700 pt-1">Est. Cost: ₹{minCost} - ₹{maxCost}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-full rounded-2xl overflow-hidden shadow-lg">
        <GoogleMap
          key={mapKey}
          mapContainerStyle={containerStyle}
          center={originLatLng || center}
          zoom={originLatLng ? 12 : 5}
          onLoad={(map) => (mapRef.current = map)}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {originLatLng && <Marker position={originLatLng} label={{ text: "A", color: "white" }} />}
          {destinationLatLng && <Marker position={destinationLatLng} label={{ text: "B", color: "white" }} />}
          {routes.map(route => (
            <Polyline
              key={route.id}
              path={route.path}
              options={{
                strokeColor: activeRoute === route.id ? "#FF5733" : (hoveredRoute === route.id ? "#9B59B6" : "#4A90E2"),
                strokeOpacity: 0.9,
                strokeWeight: activeRoute === route.id || hoveredRoute === route.id ? 8 : 6,
                zIndex: activeRoute === route.id ? 2 : 1,
              }}
              onMouseOver={(e) => { setHoveredRoute(route.id); setHoverPos(e.latLng); }}
              onMouseOut={() => { setHoveredRoute(null); setHoverPos(null); }}
            />
          ))}
          {hoveredRoute !== null && hoverPos && routes[hoveredRoute] && (
            <InfoWindow position={hoverPos} options={{ pixelOffset: new window.google.maps.Size(0, -30) }}>
              <div className="text-sm p-1">
                <p className="font-bold">{getModeIcon(subMode)} Route {hoveredRoute + 1}</p>
                <p>Distance: {(routes[hoveredRoute].distance / 1000).toFixed(1)} km</p>
                <p>Duration: {formatDuration(routes[hoveredRoute].duration)}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}