import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// Constants for Place Types
const PLACES_TYPES = ["museum", "art_gallery", "park", "tourist_attraction", "zoo", "aquarium", "landmark"];
const HOTELS_TYPES = ["hotel", "motel", "lodging"];
const FOOD_TYPES = ["restaurant", "cafe", "bakery", "bar"];

export default function ItineraryPlanner() {
  // --- UNIFIED STATE ---
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState(null);
  const [topPlaces, setTopPlaces] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [topFood, setTopFood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const destAutoRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // --- API LOGIC ---

  const fetchPlaces = async (place, types, limit) => {
    if (!place?.geometry) return [];

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    const bodyData = {
      destination: { lat, lon },
      radius: 10000,
      types: types.join(","),
      limit: limit,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!Array.isArray(data)) return [];

      return data
        .map((p) => {
          if (!p.location || !p.address) return null;
          const plat = Number(p.location.lat);
          const plon = Number(p.location.lng);
          if (isNaN(plat) || isNaN(plon)) return null;
          return { ...p, location: { lat: plat, lng: plon } };
        })
        .filter(Boolean)
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } catch (err) {
      console.error("Fetch places error:", err);
      return [];
    }
  };

  const handlePlanTrip = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      alert("Please select a valid destination from the suggestions.");
      return;
    }

    setIsLoading(true);
    setItinerary(null);
    setTopPlaces([]);
    setTopHotels([]);
    setTopFood([]);

    const destination = {
      name: place.name,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    try {
      const [itineraryResponse, places, hotels, food] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination, days }),
        }),
        fetchPlaces(place, PLACES_TYPES, 50),
        fetchPlaces(place, HOTELS_TYPES, 50),
        fetchPlaces(place, FOOD_TYPES, 50),
      ]);

      if (!itineraryResponse.ok) {
        throw new Error("Failed to generate itinerary.");
      }

      const itineraryData = await itineraryResponse.json();
      setItinerary(itineraryData.itinerary);
      
      setTopPlaces(places.slice(0, 15));
      setTopHotels(hotels.slice(0, 15));
      setTopFood(food.slice(0, 15));

    } catch (error) {
      console.error("Trip planning error:", error);
      alert("There was an error planning your trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOGIC ---

  const renderPlace = (p, i) => (
    <div
      key={i}
      className="p-3 mb-2 rounded-md border bg-white transition flex-shrink-0 w-72 mr-4 hover:shadow-md"
    >
      <div className="font-semibold text-gray-800 truncate">{p.name}</div>
      <div className="text-sm text-gray-600 truncate">{p.address}</div>
      <div className="text-sm text-yellow-600 my-1">
        ⭐ {p.rating || "N/A"} ({p.reviews || 0} reviews)
      </div>
      {p.photo && <img src={p.photo} alt={p.name} className="mt-2 w-full h-40 object-cover rounded-md border" />}
      <button
        onClick={() => {
          const query = encodeURIComponent(`${p.name}, ${p.address}`);
          const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
          window.open(url, "_blank");
        }}
        className="mt-3 w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition"
      >
        View in Maps
      </button>
    </div>
  );
  
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* --- INPUT SECTION --- */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">AI-Powered Trip Planner</h1>
          <p className="text-gray-600 mb-6">Enter your destination and trip duration to create a personalized travel plan and discover nearby places.</p>
          
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
                <input
                  type="text"
                  placeholder="e.g., Paris, France"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Autocomplete>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handlePlanTrip}
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? "Planning Your Adventure..." : "Plan My Trip"}
          </button>
        </div>

        {/* --- ITINERARY SECTION --- */}
        {itinerary && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Your Itinerary for {destAutoRef.current?.getPlace()?.name}
            </h2>
            {itinerary.map((day, index) => (
              <div key={index} className="mb-8 border-b-2 border-gray-100 pb-8 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-blue-700">Day {day.day_number}</h3>
                  <p className="text-md text-gray-600 font-medium"><strong>Stay at:</strong> {day.stay_at}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="prose max-w-none text-gray-700">
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Morning Plan</h4>
                      {day.morning_visits.map((visit, vIndex) => (
                        <div key={vIndex} className="mb-3">
                          <p className="font-semibold text-blue-600">{visit.name}</p>
                          <p className="text-sm italic text-gray-600">{visit.description}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Afternoon Plan</h4>
                      {day.afternoon_visits.map((visit, vIndex) => (
                        <div key={vIndex} className="mb-3">
                          <p className="font-semibold text-blue-600">{visit.name}</p>
                          <p className="text-sm italic text-gray-600">{visit.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Meals & Evening</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li><span className="font-semibold">Breakfast ({day.meals.breakfast.time}):</span> {day.meals.breakfast.name}</li>
                      <li><span className="font-semibold">Lunch ({day.meals.lunch.time}):</span> {day.meals.lunch.name}</li>
                      <li><span className="font-semibold">Dinner ({day.meals.dinner.time}):</span> {day.meals.dinner.name}</li>
                    </ul>
                    <div className="mt-6 pt-4 border-t">
                      <p className="font-semibold">Evening:</p>
                      <p className="text-gray-700">{day.evening_activity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PLACES EXPLORER SECTION --- */}
        {!isLoading && (topPlaces.length > 0 || topHotels.length > 0 || topFood.length > 0) && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Explore Your Destination</h2>
            
            <div>
              <h3 className="text-xl font-semibold my-4 text-gray-800">Top Places to Visit</h3>
              {topPlaces.length > 0 ? (
                <div className="flex overflow-x-auto pb-4">
                  {topPlaces.map(renderPlace)}
                </div>
              ) : <div className="text-gray-500 text-sm">No recommended places found.</div>}
            </div>

            <div>
              <h3 className="text-xl font-semibold my-4 text-gray-800">Top Hotels</h3>
              {topHotels.length > 0 ? (
                <div className="flex overflow-x-auto pb-4">
                  {topHotels.map(renderPlace)}
                </div>
              ) : <div className="text-gray-500 text-sm">No recommended hotels found.</div>}
            </div>

            <div>
              <h3 className="text-xl font-semibold my-4 text-gray-800">Top Food Places</h3>
              {topFood.length > 0 ? (
                <div className="flex overflow-x-auto pb-4">
                  {topFood.map(renderPlace)}
                </div>
              ) : <div className="text-gray-500 text-sm">No recommended food places found.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}