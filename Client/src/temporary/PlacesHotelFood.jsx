import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const PLACES_TYPES = [
  "museum", "art_gallery", "park", "tourist_attraction", "zoo", "aquarium", "landmark"
];
const HOTELS_TYPES = ["hotel", "motel", "lodging"];
const FOOD_TYPES = ["restaurant", "cafe", "bakery", "bar"];
const libraries = ['places'];

// 1. Define a Set of unwanted place types for efficient lookup.
const UNWANTED_PLACE_TYPES = new Set(["school", "college", "university", "bank", "atm", "finance", "post_office"]);
// New: Define a list of unwanted keywords to check against the place name.
const UNWANTED_PLACE_KEYWORDS = ["school", "bank", "atm", "college", "university", "post office", "church", "mosque", "temple"];

export default function GooglePlaces() {
  const [topPlaces, setTopPlaces] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [topFood, setTopFood] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchState, setSearchState] = useState("initial"); // 'initial', 'searching', 'results'

  const destAutoRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchPlaces = async (types) => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) return [];
    
    const { lat, lng } = place.geometry.location;
    const bodyData = { destination: { lat: lat(), lon: lng() }, radius: 10000, types: types.join(","), limit: 50 };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      
      return Array.isArray(data) 
        ? data
            .map(p => ({ ...p, location: { lat: Number(p.location.lat), lng: Number(p.location.lng) }}))
            .filter(p => p.location && p.address && !isNaN(p.location.lat) && !isNaN(p.location.lng))
            // 2. Updated filter logic to check both types and name.
            .filter(p => {
              // First, filter out by place type
              const hasUnwantedType = p.types && p.types.some(type => UNWANTED_PLACE_TYPES.has(type));
              if (hasUnwantedType) {
                return false;
              }
              
              // Second, filter out if the name contains unwanted keywords
              const nameLower = p.name.toLowerCase();
              const hasUnwantedKeyword = UNWANTED_PLACE_KEYWORDS.some(keyword => nameLower.includes(keyword));
              if (hasUnwantedKeyword) {
                return false;
              }
              
              // If it passes both checks, keep it
              return true;
            })
            .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        : [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!destAutoRef.current?.getPlace()?.geometry) {
      alert("Please select a valid destination from the suggestions.");
      return;
    }
    setSearchState("searching");
    const [places, hotels, food] = await Promise.all([ fetchPlaces(PLACES_TYPES), fetchPlaces(HOTELS_TYPES), fetchPlaces(FOOD_TYPES) ]);
    setTopPlaces(places.slice(0, 15));
    setTopHotels(hotels.slice(0, 15));
    setTopFood(food.slice(0, 15));
    setSearchState("results");
  };

  const renderPlace = (p, i) => (
    <div
      key={i}
      className={`p-4 rounded-lg flex-shrink-0 w-72 mr-4 bg-white/90 backdrop-blur-sm border transform transition-all duration-300 ease-in-out ${
        selectedPlace === p 
          ? "border-orange-400 ring-2 ring-orange-200 shadow-lg" 
          : "border-orange-200 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      <div className="cursor-pointer" onClick={() => setSelectedPlace(p)}>
        <div className="font-semibold text-gray-800 truncate">{p.name}</div>
        <div className="text-sm text-gray-600 truncate">{p.address}</div>
        <div className="text-sm text-yellow-600 my-1">⭐ {p.rating || "N/A"} ({p.reviews || 0} reviews)</div>
        {p.photo && <img src={p.photo} alt={p.name} className="mt-2 w-full h-40 object-cover rounded-md border" />}
      </div>
      <button
        onClick={() => {
          const query = encodeURIComponent(`${p.name}, ${p.address}`);
          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
        }}
        className="mt-3 w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg transform hover:scale-105 transition-transform duration-200"
      >
        View in Maps
      </button>
    </div>
  );
  
  const renderNoResults = (type) => (
    <div className="p-6 bg-white/80 rounded-lg border border-orange-200 text-center text-gray-500">
      😕 Could not find any recommended {type}.
    </div>
  );

  if (!isLoaded) return <div className="flex justify-center items-center h-screen font-bold text-orange-600">Loading Maps...</div>;

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-orange-50 flex flex-col items-center">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          Explore Your Next Destination
        </h1>
        <p className="text-gray-700">Find top places, hotels, and restaurants for your trip.</p>
      </div>

      <div className="w-full max-w-2xl shadow-lg bg-white/90 backdrop-blur-sm border border-orange-200 rounded-xl p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium text-gray-700">📍 Destination City</label>
            <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)} className="w-full">
              <input
                type="text"
                placeholder="Enter a city and select from suggestions"
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 hover:border-orange-400 transition-colors duration-200"
              />
            </Autocomplete>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={searchState === 'searching'}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:transform-none"
            >
              {searchState === 'searching' ? "⏳ Searching..." : "Find Places"}
            </button>
          </div>
        </div>
      </div>

      {searchState === "results" && (
        <div className="w-full max-w-7xl mt-8">
          <section>
            <h2 className="text-2xl font-semibold my-4 text-gray-800">Top Places to Visit</h2>
            {topPlaces.length > 0 ? <div className="flex overflow-x-auto pb-4 -mx-4 px-4">{topPlaces.map(renderPlace)}</div> : renderNoResults("places")}
          </section>
          <section>
            <h2 className="text-2xl font-semibold my-4 text-gray-800">Top Rated Hotels</h2>
            {topHotels.length > 0 ? <div className="flex overflow-x-auto pb-4 -mx-4 px-4">{topHotels.map(renderPlace)}</div> : renderNoResults("hotels")}
          </section>
          <section>
            <h2 className="text-2xl font-semibold my-4 text-gray-800">Best Food & Dining</h2>
            {topFood.length > 0 ? <div className="flex overflow-x-auto pb-4 -mx-4 px-4">{topFood.map(renderPlace)}</div> : renderNoResults("food places")}
          </section>
        </div>
      )}
    </div>
  );
}