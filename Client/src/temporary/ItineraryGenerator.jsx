import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

export default function ItineraryGenerator() {
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const destAutoRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleGenerateItinerary = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      alert("Please select a valid destination from the suggestions.");
      return;
    }

    setIsLoading(true);
    setItinerary(null);

    const destination = {
      name: place.name,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate itinerary.");
      }

      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (error) {
      console.error("Itinerary generation error:", error);
      alert("There was an error generating the itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">AI-Powered Itinerary Planner</h1>
          <p className="text-gray-600 mb-6">Enter your destination and trip duration, and let our AI create a personalized travel plan for you.</p>
          
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
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                min="1"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerateItinerary}
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? "Generating Your Adventure..." : "Create My Itinerary"}
          </button>
        </div>

        {itinerary && (
  <div className="bg-white p-8 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
      Your Itinerary for {destAutoRef.current?.getPlace()?.name}
    </h2>

    {itinerary.map((day, index) => (
      <div key={index} className="mb-8 border-b-2 border-gray-100 pb-8">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-blue-700">Day {day.day_number}</h3>
          <p className="text-md text-gray-600 font-medium">
            <strong>Stay at:</strong> {day.stay_at}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Visits */}
          <div className="prose max-w-none text-gray-700">
            {/* Morning Visits */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Morning Plan</h4>
              {day.morning_visits.map((visit, vIndex) => (
                <div key={vIndex} className="mb-3">
                  <p className="font-semibold text-blue-600">{visit.name}</p>
                  <p className="text-sm italic text-gray-600">{visit.description}</p>
                </div>
              ))}
            </div>

            {/* Afternoon Visits */}
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

          {/* Right Column: Meals and Evening */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Meals & Evening</h4>
            
            {/* Meal Suggestions */}
            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="font-semibold">Breakfast ({day.meals.breakfast.time}):</span> {day.meals.breakfast.name}
              </li>
              <li>
                <span className="font-semibold">Lunch ({day.meals.lunch.time}):</span> {day.meals.lunch.name}
              </li>
              <li>
                <span className="font-semibold">Dinner ({day.meals.dinner.time}):</span> {day.meals.dinner.name}
              </li>
            </ul>

            {/* Evening Activity */}
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
      </div>
    </div>
  );
}



