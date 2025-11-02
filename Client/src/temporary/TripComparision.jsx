import { useState, useRef } from "react";
import axios from 'axios';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaPlaneDeparture, FaUserFriends } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// --- Components for UI ---
import TripResult from "./TripResult"; // We'll create this display component below
const LoadingSpinner = () => <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div></div>;
const ErrorMessage = ({ message }) => <div className="text-center p-4 my-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"><p><strong>Oops!</strong> {message}</p></div>;

// --- Constants ---
const libraries = ["places"];

export default function TripComparator() {
  // --- STATE MANAGEMENT ---
  const [destination1, setDestination1] = useState({ name: '', lat: null, lon: null });
  const [destination2, setDestination2] = useState({ name: '', lat: null, lon: null });
  const [travelType, setTravelType] = useState('couple');
  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- REFS FOR AUTOCOMPLETE ---
  const autocomplete1Ref = useRef(null);
  const autocomplete2Ref = useRef(null);

  // --- GOOGLE API LOADER ---
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useAuth();

  // --- HANDLERS ---
  const onLoad1 = (autocomplete) => {
    autocomplete1Ref.current = autocomplete;
  };
  const onPlaceChanged1 = () => {
    if (autocomplete1Ref.current) {
      const place = autocomplete1Ref.current.getPlace();
      if (place.geometry) {
        setDestination1({
          name: place.formatted_address,
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng(),
        });
      }
    }
  };

  const onLoad2 = (autocomplete) => {
    autocomplete2Ref.current = autocomplete;
  };
  const onPlaceChanged2 = () => {
    if (autocomplete2Ref.current) {
      const place = autocomplete2Ref.current.getPlace();
      if (place.geometry) {
        setDestination2({
          name: place.formatted_address,
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng(),
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!destination1.lat || !destination2.lat) {
      setError("Please select two valid destinations from the suggestions.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTripPlan(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/trip/plan-trip`, { destination1, destination2, travelType });
      setTripPlan(response.data.plan);
    } catch (err) {
      setError(err.response?.data?.error || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    // --- LOGIN PROMPT ---
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to use the Trip Planner and save your trips.</p>
          <Link to="/signin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-orange-50/50 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            AI Trip Comparator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Can't decide where to go? Let AI compare two cities and recommend the perfect spot for your next adventure!
          </p>
        </div>

        {/* Form Card */}
        <div className="shadow-lg bg-white/90 backdrop-blur-sm border border-orange-200 rounded-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              
              {/* Destination 1 Input */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center"><FaMapMarkerAlt className="mr-2 text-orange-600"/> First Destination</label>
                {isLoaded ? (
                  <Autocomplete onLoad={onLoad1} onPlaceChanged={onPlaceChanged1} options={{ types: ["(cities)"] }}>
                    <input type="text" placeholder="Enter a city name" className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition" />
                  </Autocomplete>
                ) : (
                  <input type="text" placeholder="Loading maps..." disabled className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100" />
                )}
              </div>

              {/* Destination 2 Input */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center"><FaPlaneDeparture className="mr-2 text-orange-600"/> Second Destination</label>
                {isLoaded ? (
                  <Autocomplete onLoad={onLoad2} onPlaceChanged={onPlaceChanged2} options={{ types: ["(cities)"] }}>
                    <input type="text" placeholder="Enter another city" className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition" />
                  </Autocomplete>
                ) : (
                  <input type="text" placeholder="Loading maps..." disabled className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100" />
                )}
              </div>
              
              {/* Travel Type Dropdown */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center"><FaUserFriends className="mr-2 text-orange-600"/> Travel Type</label>
                <select value={travelType} onChange={(e) => setTravelType(e.target.value)} className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 transition">
                  <option value="single">👤 Single</option>
                  <option value="couple">💑 Couple</option>
                  <option value="family">👨‍👩‍👧‍👦 Family</option>
                  <option value="friends">🧑‍🤝‍🧑 Friends</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button onClick={handleSubmit} disabled={isLoading || !isLoaded} className="px-10 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:scale-100">
                {isLoading ? "Analyzing..." : "Plan My Trip"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {error && <ErrorMessage message={error} />}
        {isLoading && <LoadingSpinner />}
        {tripPlan && <TripResult plan={tripPlan} />}
      </div>
    </div>
  );
}