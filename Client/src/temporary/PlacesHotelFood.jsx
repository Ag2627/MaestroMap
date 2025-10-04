import { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

// Hidden types for Google Places
const PLACES_TYPES = [
  "museum",
  "art_gallery",
  "park",
  "tourist_attraction",
  "zoo",
  "aquarium",
  "landmark"
];
const HOTELS_TYPES = [
    "hotel",
    "motel",
    "lodging"
];
const FOOD_TYPES = [
    "restaurant",
    "cafe",
    "bakery",
    "bar"
];
const libraries=['places'];
export default function GooglePlaces() {
  const [destLatLng, setDestLatLng] = useState(null);
  const [topPlaces, setTopPlaces] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [topFood, setTopFood] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [radius, setRadius] = useState(10000);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const destAutoRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchPlaces = async (types, limit) => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) return [];

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    const bodyData = {
      destination: { lat, lon },
      radius: Number(radius),
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
          if (Number.isNaN(plat) || Number.isNaN(plon)) return null;
          return { ...p, location: { lat: plat, lng: plon } };
        })
        .filter(Boolean)
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };


  const handleSearch = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      alert("Select a valid destination from autocomplete");
      return;
    }

    const lat = place.geometry.location.lat();
    const lon = place.geometry.location.lng();

    setDestLatLng({ lat, lng: lon });
    setSelectedPlace(null);

    const [places, hotels, food] = await Promise.all([
    fetchPlaces(PLACES_TYPES, 50),
    fetchPlaces(HOTELS_TYPES, 50),
    fetchPlaces(FOOD_TYPES, 50)
]);

    setTopPlaces(places.slice(0, 15));
    setTopHotels(hotels.slice(0, 15));
    setTopFood(food.slice(0, 15));

    setMapKey((k) => k + 1);

    if (mapRef.current) {
        const allPlaces = [...places, ...hotels, ...food];
        if(allPlaces.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            allPlaces.forEach((p) => bounds.extend(p.location));
            bounds.extend({ lat, lng: lon });
            mapRef.current.fitBounds(bounds);
        }
    }
  };


  const handleSidebarClick = (place) => {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.panTo(place.location);
      mapRef.current.setZoom(16);
    }
  };

  const renderPlace = (p, i) => (
    <div
      key={i}
      className={`p-3 mb-2 rounded-md transition flex-shrink-0 w-72 mr-4 ${
        selectedPlace === p ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100 border"
      }`}
    >
      <div onClick={() => handleSidebarClick(p)} className="cursor-pointer">
        <div className="font-semibold text-gray-800 truncate">{p.name}</div>
        <div className="text-sm text-gray-600 truncate">{p.address}</div>
        <div className="text-sm text-yellow-600">
          ⭐ {p.rating || "N/A"} ({p.reviews || 0} reviews)
        </div>
        {p.photo && <img src={p.photo} alt={p.name} className="mt-2 w-full h-40 object-cover rounded-md border" />}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card's onClick from firing
          const query = encodeURIComponent(`${p.name}, ${p.address}`);
          const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
          window.open(url, "_blank");
        }}
        className="mt-2 w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
      >
        View in Maps
      </button>
    </div>
  );


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-full p-4 border-r overflow-y-auto bg-gray-50 flex flex-col">
        <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Explore and Discover</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)} className="w-full">
                    <input
                        type="text"
                        placeholder="Enter destination (select suggestion)"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Autocomplete>


                <button
                    onClick={handleSearch}
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    Find Places
                </button>
            </div>
        </div>


        <div className="flex-grow overflow-y-auto">
            {/* Top Places */}
            <div>
                <h2 className="text-xl font-semibold my-4 text-gray-800">Top Places to Visit</h2>
                {topPlaces.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4">
                        {topPlaces.map(renderPlace)}
                    </div>
                ) : <div className="text-gray-500 text-sm">No places to show yet.</div>}
            </div>

            {/* Top Hotels */}
            <div>
                <h2 className="text-xl font-semibold my-4 text-gray-800">Top Hotels</h2>
                {topHotels.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4">
                        {topHotels.map(renderPlace)}
                    </div>
                ) : <div className="text-gray-500 text-sm">No hotels to show yet.</div>}
            </div>

            {/* Top Food */}
            <div>
                <h2 className="text-xl font-semibold my-4 text-gray-800">Top Food Places</h2>
                {topFood.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4">
                        {topFood.map(renderPlace)}
                    </div>
                ) : <div className="text-gray-500 text-sm">No food places to show yet.</div>}
            </div>
        </div>

      </div>
    </div>
  );
}