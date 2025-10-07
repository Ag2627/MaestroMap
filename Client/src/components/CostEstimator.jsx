import { useState, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom"; // Use Link for navigation

const libraries = ["places"];

// No changes are needed in the RouteDetailsCard component
const RouteDetailsCard = ({ route, costDetails, origin, destination, isActive, onClick }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleViewOnMap = (e) => {
    e.stopPropagation();
    if (!origin || !destination) return;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  const renderCostBreakdown = () => {
    const { breakdown } = costDetails;
    return (
      <ul className="text-xs text-gray-500 mt-2 space-y-1">
        {Object.entries(breakdown).map(([key, value]) => {
          if (value > 0) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return (
              <li key={key} className="flex justify-between">
                <span>{formattedKey}:</span>
                <span className="font-medium">₹{value}</span>
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 border rounded-lg bg-gradient-to-br from-white to-orange-50 shadow-md transform transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
        isActive ? "ring-2 ring-orange-400 border-orange-400" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <p className="text-xs font-medium text-gray-500 truncate" title={`${origin} to ${destination}`}>
            {origin} → {destination}
          </p>
          <p className="text-lg font-bold text-green-700">
            Est. Cost: ₹{costDetails.minCost} - ₹{costDetails.maxCost}
          </p>
          <p className="text-xs text-gray-600">
            Distance: <b>{(route.distance / 1000).toFixed(1)} km</b> | Duration: <b>{route.duration}</b>
          </p>
        </div>
        <div className="text-right pl-2 flex flex-col items-end">
            <p className="text-2xl">{route.icon}</p>
            <div className="flex items-center gap-3 mt-1">
                <button
                    onClick={handleViewOnMap}
                    title="View on Google Maps"
                    className="text-orange-600 hover:text-orange-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDetailsVisible(!isDetailsVisible);
                    }}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-800"
                >
                    {isDetailsVisible ? "Hide" : "Details"}
                </button>
            </div>
        </div>
      </div>
      {isDetailsVisible && (
        <div className="mt-2 pt-2 border-t border-dashed">
          {renderCostBreakdown()}
        </div>
      )}
    </div>
  );
};


export default function CostEstimator() {
  const [mode, setMode] = useState("PERSONAL");
  const [subMode, setSubMode] = useState("4W");
  const [routes, setRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState({ origin: "", destination: "" });
  const [error, setError] = useState(null);

  const originRef = useRef(null);
  const destRef = useRef(null);
  const { user } = useAuth(); // Get user from context

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const formatDuration = (durationString) => {
    const seconds = parseInt(durationString.slice(0, -1));
    if (isNaN(seconds)) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  const getModeIcon = (subMode) => {
    const icons = { "4W": "🚗", BIKE: "🏍️", BUS: "🚌", SLEEPER: "🚆", "3AC": "🚆", CAR_BOOKING: "🚖" };
    return icons[subMode] || "❓";
  };

  const calculateCost = (distanceMeters, mode, subMode) => {
    const distanceKm = distanceMeters / 1000;
    let baseCost = 0;
    const breakdown = {};

    switch (mode) {
      case "PERSONAL":
        const fuelPrice = 105;
        if (subMode === "4W") {
          breakdown.tollCost = Math.max(50, Math.floor(distanceKm / 60) * 120);
          breakdown.fuelCost = Math.round((distanceKm / 17) * fuelPrice);
          baseCost = breakdown.fuelCost + breakdown.tollCost;
        } else {
          breakdown.fuelCost = Math.round((distanceKm / 40) * fuelPrice);
          baseCost = breakdown.fuelCost;
        }
        break;
      case "TRANSIT":
        breakdown.baseFare = subMode === "BUS" ? 20 : subMode === "SLEEPER" ? 80 : 150;
        const costPerKm = subMode === "BUS" ? 2.5 : subMode === "SLEEPER" ? 0.45 : 2.2;
        breakdown.distanceCost = Math.round(distanceKm * costPerKm);
        baseCost = breakdown.baseFare + breakdown.distanceCost;
        break;
      case "CAR_BOOKING":
        breakdown.baseFare = 80;
        breakdown.tollCost = Math.max(30, Math.floor(distanceKm / 50) * 80);
        breakdown.distanceCost = Math.round(distanceKm * 15);
        baseCost = breakdown.baseFare + breakdown.distanceCost + breakdown.tollCost;
        break;
    }

    const timeMultiplier = distanceKm > 500 ? 1.2 : distanceKm > 200 ? 1.1 : 1;
    const finalCost = baseCost * timeMultiplier;
    
    return {
      minCost: Math.round(finalCost * 0.85),
      maxCost: Math.round(finalCost * 1.15),
      breakdown,
    };
  };

  const fetchRoutes = async (origin, destination) => {
    setIsLoadingRoutes(true);
    setError(null);
    setRoutes([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/find`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination, travelMode: "DRIVE" }),
      });
      if (!res.ok) throw new Error("Failed to fetch routes. Please try again.");

      const data = await res.json();

      if (data.routes?.length > 0) {
        const decodedRoutes = data.routes.filter(r => r.polyline?.encodedPolyline).slice(0, 3).map((r, idx) => ({
          id: idx,
          distance: r.distanceMeters,
          duration: formatDuration(r.duration),
          icon: getModeIcon(subMode)
        }));
        setRoutes(decodedRoutes);
        setSearchQuery({ origin, destination });
      } else {
        setError("No routes found for the given locations.");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleFindRoutes = () => {
    const origin = originRef.current?.value || "";
    const destination = destRef.current?.value || "";
    if (origin && destination) fetchRoutes(origin, destination);
    else alert("Please enter both origin and destination.");
  };

  const handleCheckFlights = () => {
    const origin = originRef.current?.value || "";
    const destination = destRef.current?.value || "";

    if (!origin || !destination) {
      alert("Please enter both origin and destination to check for flights.");
      return;
    }

    const formatDate = (date) => date.toISOString().split('T')[0];
    const today = new Date();
    const departureDate = formatDate(today);

    const flightsUrl = `https://www.google.com/flights?q=flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${departureDate}`;
    
    window.open(flightsUrl, "_blank", "noopener,noreferrer");
  };

  const handleFindHotels = () => {
    const destination = destRef.current?.value || "";

    if (!destination) {
        alert("Please enter a destination to find hotels.");
        return;
    }

    const hotelsUrl = `https://www.google.com/travel/hotels/${encodeURIComponent(destination)}`;
    
    window.open(hotelsUrl, "_blank", "noopener,noreferrer");
  };

  const inputStyle = "w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition-colors duration-200";
  const labelStyle = "font-medium text-gray-700 flex items-center gap-2";

  if (!isLoaded) return <div className="flex justify-center items-center h-screen font-bold text-orange-600">Loading Maps...</div>;

  // --- RENDER-GATE: If no user, show login prompt ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the Route Cost Estimator.</p>
          <Link to="/signin">
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- Main component render for authenticated users ---
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Route Cost Estimator
          </h1>
          <p className="text-gray-700 flex items-center justify-center gap-2">
            🚗 Plan your trip with accurate cost predictions
          </p>
        </div>

        {/* Search Form */}
        <div className="shadow-lg bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className={labelStyle}>📍 Origin</label>
                <Autocomplete><input type="text" placeholder="Enter Origin" ref={originRef} className={inputStyle} /></Autocomplete>
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>🏁 Destination</label>
                <Autocomplete><input type="text" placeholder="Enter Destination" ref={destRef} className={inputStyle} /></Autocomplete>
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>⚙️ Mode</label>
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
                <label className={labelStyle}>{getModeIcon(subMode)} Vehicle</label>
                {mode === "PERSONAL" && <select className={inputStyle} value={subMode} onChange={e => setSubMode(e.target.value)}><option value="4W">4-Wheeler</option><option value="BIKE">Bike</option></select>}
                {mode === "TRANSIT" && <select className={inputStyle} value={subMode} onChange={e => setSubMode(e.target.value)}><option value="BUS">Bus</option><option value="SLEEPER">Train (Sleeper)</option><option value="3AC">Train (3AC)</option></select>}
                {mode === "CAR_BOOKING" && <select className={inputStyle} disabled><option>Car</option></select>}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={handleFindRoutes}
                disabled={isLoadingRoutes}
                className="w-full sm:w-auto flex-grow px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 disabled:opacity-70"
              >
                {isLoadingRoutes ? "⏳ Estimating..." : "🔍 Find Routes & Costs"}
              </button>
              <button
                onClick={handleCheckFlights}
                className="w-full sm:w-auto flex-grow px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
              >
                ✈️ Check Flights
              </button>
              <button
                onClick={handleFindHotels}
                className="w-full sm:w-auto flex-grow px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
              >
                🏨 Find Hotels
              </button>
            </div>

          </div>
        </div>
        
        {isLoadingRoutes && <div className="text-center text-orange-600 font-medium">Loading...</div>}

        {error && (
            <div className="shadow-lg bg-red-50 border-red-200 rounded-2xl p-6">
                <h3 className="text-xl text-red-800 font-bold">⚠️ An Error Occurred</h3>
                <p className="text-red-700 font-medium mt-2">{error}</p>
            </div>
        )}

        {routes.length > 0 && !isLoadingRoutes && (
          <div className="shadow-xl bg-white/90 backdrop-blur-md border border-orange-200 rounded-2xl">
            <div className="p-6">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Estimated Routes for {searchQuery.origin} to {searchQuery.destination}</h2>
              <div className="flex flex-col gap-4">
                {routes.map((route) => (
                  <RouteDetailsCard
                    key={route.id}
                    route={route}
                    costDetails={calculateCost(route.distance, mode, subMode)}
                    origin={searchQuery.origin}
                    destination={searchQuery.destination}
                    isActive={activeRoute === route.id}
                    onClick={() => setActiveRoute(route.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}