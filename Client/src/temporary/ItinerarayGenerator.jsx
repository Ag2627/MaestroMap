// import { useState, useRef } from "react";
// import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
// import { useAuth } from "../context/authContext"; // Make sure the path is correct
// import { Link } from "react-router-dom";
// import { Button } from '../components/ui/button';
// export default function ItineraryGenerator() {
//   const [days, setDays] = useState(3);
//   const [itinerary, setItinerary] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const destAutoRef = useRef(null);
//   const { user } = useAuth(); // Use your existing AuthContext

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   const handleGenerateItinerary = async () => {
//     const place = destAutoRef.current?.getPlace();
//     if (!place?.geometry) {
//       alert("Please select a valid destination from the suggestions.");
//       return;
//     }

//     setIsLoading(true);
//     setItinerary(null);

//     const destination = {
//       name: place.name,
//       lat: place.geometry.location.lat(),
//       lng: place.geometry.location.lng(),
//     };

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
//         method: "POST",
//         headers: {
//            "Content-Type": "application/json",
//            // Send the user's token for backend authorization
//            "Authorization": `Bearer ${user.token}`
//         },
//         body: JSON.stringify({ destination, days }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to generate itinerary.");
//       }

//       const data = await response.json();
//       setItinerary(data.itinerary);
//     } catch (error) {
//       console.error("Itinerary generation error:", error);
//       alert("There was an error generating the itinerary. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveItinerary = async () => {
//     if (!itinerary || !user) return;

//     const place = destAutoRef.current?.getPlace();
//     if (!place) return;


//     setIsSaving(true);
//     try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/save`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${user.token}` // Crucial for identifying the user on the backend
//             },
//             body: JSON.stringify({
//                 destinationName: place.name,
//                 itineraryData: itinerary,
//                 // userId is not needed in the body if the backend can identify the user from the token
//             }),
//         });

//         if (!response.ok) {
//             throw new Error("Failed to save the itinerary.");
//         }

//         alert("Itinerary saved to 'My Trips'!");
//     } catch (error) {
//         console.error("Save itinerary error:", error);
//         alert("There was an error saving your itinerary.");
//     } finally {
//         setIsSaving(false);
//     }
//   };

//   if (!isLoaded) return <div className="text-center p-10">Loading Google Maps...</div>;

//   // If the user is not logged in, render a message
//   if (!user) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <div className="text-center bg-white p-10 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
//           <p className="text-gray-600">Please log in to use the Itinerary Generator and save your trips.</p>
//           {/* You might want to add a <Link to="/login">Login</Link> component here */}
//           <Link to="/signin">
//         <Button 
//           className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
//           data-testid="header-login-btn"
//         >
//           <i className="fab fa-google mr-2"></i>
//           Sign In
//         </Button>
//       </Link>
//         </div>
//       </div>
//     );
//   }

//   // If the user is logged in, render the generator
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen font-sans">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">AI-Powered Itinerary Planner</h1>
//           <p className="text-gray-600 mb-6">Enter your destination and trip duration, and let our AI create a personalized travel plan for you.</p>
//           {/* ... (rest of the form is the same as your original code) ... */}
          
//           <div className="grid md:grid-cols-3 gap-4 items-end">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//               <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
//                 <input
//                   type="text"
//                   placeholder="e.g., Paris, France"
//                   className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </Autocomplete>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
//               <select
//                 value={days}
//                 onChange={(e) => setDays(Number(e.target.value))}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="1">1 Day</option>
//                 <option value="2">2 Days</option>
//                 <option value="3">3 Days</option>
//                 <option value="4">4 Days</option>
//                 <option value="5">5 Days</option>
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={handleGenerateItinerary}
//             disabled={isLoading}
//             className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
//           >
//             {isLoading ? "Generating Your Adventure..." : "Create My Itinerary"}
//           </button>
//         </div>


//         {itinerary && (
//   <div className="bg-white p-8 rounded-lg shadow-lg">
//     <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//       Your Itinerary for {destAutoRef.current?.getPlace()?.name}
//     </h2>

//     {itinerary.map((day, index) => (
//       <div key={index} className="mb-8 border-b-2 border-gray-100 pb-8">
//         {/* Day Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-2xl font-semibold text-blue-700">Day {day.day_number}</h3>
//           <p className="text-md text-gray-600 font-medium">
//             <strong>Stay at:</strong> {day.stay_at}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left Column: Visits */}
//           <div className="prose max-w-none text-gray-700">
//             {/* Morning Visits */}
//             <div className="mb-6">
//               <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Morning Plan</h4>
//               {day.morning_visits.map((visit, vIndex) => (
//                 <div key={vIndex} className="mb-3">
//                   <p className="font-semibold text-blue-600">{visit.name}</p>
//                   <p className="text-sm italic text-gray-600">{visit.description}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Afternoon Visits */}
//             <div>
//               <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Afternoon Plan</h4>
//               {day.afternoon_visits.map((visit, vIndex) => (
//                 <div key={vIndex} className="mb-3">
//                   <p className="font-semibold text-blue-600">{visit.name}</p>
//                   <p className="text-sm italic text-gray-600">{visit.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Column: Meals and Evening */}
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Meals & Evening</h4>
            
//             {/* Meal Suggestions */}
//             <ul className="space-y-3 text-gray-700">
//               <li>
//                 <span className="font-semibold">Breakfast ({day.meals.breakfast.time}):</span> {day.meals.breakfast.name}
//               </li>
//               <li>
//                 <span className="font-semibold">Lunch ({day.meals.lunch.time}):</span> {day.meals.lunch.name}
//               </li>
//               <li>
//                 <span className="font-semibold">Dinner ({day.meals.dinner.time}):</span> {day.meals.dinner.name}
//               </li>
//             </ul>

//             {/* Evening Activity */}
//             <div className="mt-6 pt-4 border-t">
//               <p className="font-semibold">Evening:</p>
//               <p className="text-gray-700">{day.evening_activity}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// )}
//         {itinerary && (
//           <div className="bg-white p-8 rounded-lg shadow-lg">
//             {/* ... (your existing itinerary display code is the same) ... */}
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Itinerary for {destAutoRef.current?.getPlace()?.name}</h2>
//             {/* ... */}

//             <button
//                 onClick={handleSaveItinerary}
//                 disabled={isSaving}
//                 className="w-full mt-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-green-300"
//             >
//                 {isSaving ? "Saving..." : "Save This Itinerary to My Trips"}
//             </button>
//           </div>
//         )}


        


//       </div>
//     </div>
//   );
// }


// src/pages/ItineraryGenerator.js (or your temporary folder)

import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaPlaneDeparture } from "react-icons/fa"
// Import your reusable components
import ItineraryDisplay from "./ItineraryDisplay"; // Adjust path if needed
import { Button } from '../components/ui/button'; // Adjust path if needed

// Constants for Place Types
const PLACES_TYPES = ["museum", "art_gallery", "park", "tourist_attraction", "zoo", "aquarium", "landmark"];
const HOTELS_TYPES = ["hotel", "motel", "lodging"];
const FOOD_TYPES = ["restaurant", "cafe", "bakery", "bar"];
const libraries=["places"];
export default function ItineraryGenerator() {
  // --- UNIFIED STATE from both components ---
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState(null);
  const [topPlaces, setTopPlaces] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [topFood, setTopFood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const destAutoRef = useRef(null);
  const { user } = useAuth();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // --- HELPER FUNCTION to fetch nearby places ---
  const fetchPlaces = async (place, types, limit) => {
    if (!place?.geometry) return [];
    const { lat, lng } = place.geometry.location;
    const bodyData = {
      destination: { lat: lat(), lon: lng() },
      radius: 10000,
      types: types.join(","),
      limit,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      return Array.isArray(data) ? data.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)) : [];
    } catch (err) {
      console.error("Fetch places error:", err);
      return [];
    }
  };

  // --- MAIN HANDLER to generate everything ---
  const handlePlanTrip = async () => {
    const place = destAutoRef.current?.getPlace();
    if (!place?.geometry) {
      toast.error("Please select a valid destination from the suggestions.");
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
    
    // Use a toast promise for the entire planning process
    const planPromise = Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`, // Auth token is crucial
        },
        body: JSON.stringify({ destination, days }),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to generate itinerary.");
        return res.json();
      }),
      fetchPlaces(place, PLACES_TYPES, 50),
      fetchPlaces(place, HOTELS_TYPES, 50),
      fetchPlaces(place, FOOD_TYPES, 50),
    ]);

    toast.promise(planPromise, {
      loading: 'Planning your adventure...',
      success: ([itineraryData, places, hotels, food]) => {
        setItinerary(itineraryData.itinerary);
        setTopPlaces(places.slice(0, 15));
        setTopHotels(hotels.slice(0, 15));
        setTopFood(food.slice(0, 15));
        setIsLoading(false);
        return 'Your trip is ready!';
      },
      error: (err) => {
        console.error("Trip planning error:", err);
        setIsLoading(false);
        return `Error: ${err.message}`;
      },
    });
  };

  // --- SAVE HANDLER (now with toasts) ---
  const handleSaveItinerary = async () => {
    if (!itinerary || !user) return;
    const place = destAutoRef.current?.getPlace();
    if (!place) return;

    setIsSaving(true);
    
    const savePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            destinationName: place.name,
            itineraryData: itinerary,
        }),
    }).then(res => {
        if (!res.ok) throw new Error("Failed to save the itinerary.");
        return res.json();
    });

    toast.promise(savePromise, {
        loading: 'Saving to My Trips...',
        success: 'Itinerary saved successfully!',
        error: 'There was an error saving your itinerary.',
    });

    setIsSaving(false);
  };
  
  // --- Reusable render function for place cards ---
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

  if (!isLoaded) return <div className="text-center p-10">Loading Google Maps...</div>;

  // --- RENDER LOGIC ---

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

  return (
  <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
  <div className="w-full max-w-6xl space-y-8">
    <div className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl p-8 mb-6">
        
            {/* Header Section */}
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                AI-Powered Trip Planner
                </h1>
                <p className="text-gray-700 text-lg">
                Craft your perfect journey in seconds.
                </p>
            </div>

            {/* Form Inputs Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                {/* Destination Input */}
                <div className="md:col-span-3 space-y-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500" />
                    Destination
                </label>
                <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
                    <input
                    type="text"
                    placeholder="Enter a city, e.g., Rome, Italy"
                    className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    />
                </Autocomplete>
                </div>

                {/* Number of Days Input */}
                <div className="md:col-span-2 space-y-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" />
                    Duration
                </label>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                >
                    {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} Day{d > 1 && 's'}</option>)}
                </select>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* Primary Action: Plan My Trip */}
                <button
                onClick={handlePlanTrip}
                disabled={isLoading}
                className="flex-grow w-full text-lg py-3 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                <FaPlaneDeparture />
                {isLoading ? "Planning..." : "Plan My Trip"}
                </button>
                
                {/* Secondary Action: My Trips */}
                <Link to="/my-trips" className="w-full sm:w-auto">
                <button className="w-full text-lg py-3 px-6 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                    <FaBookOpen />
                    My Trips
                </button>
                </Link>
            </div>
            </div>

        {/* --- DYNAMIC CONTENT SECTION --- */}
        {itinerary && (
          <div className="space-y-8">
            {/* --- ITINERARY & SAVE BUTTON --- */}
            <div>
              <ItineraryDisplay 
                itinerary={itinerary} 
                destinationName={destAutoRef.current?.getPlace()?.name || ''} 
              />
              <div className="bg-white p-8 rounded-b-lg shadow-lg -mt-2">
                <button
                  onClick={handleSaveItinerary}
                  disabled={isSaving}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-green-300"
                >
                  {isSaving ? "Saving..." : "Save This Itinerary to My Trips"}
                </button>
              </div>
            </div>
            
            {/* --- PLACES EXPLORER --- */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Explore Your Destination</h2>
              <div>
                <h3 className="text-xl font-semibold my-4 text-gray-800">Top Places to Visit</h3>
                {topPlaces.length > 0 ? (
                  <div className="flex overflow-x-auto pb-4">{topPlaces.map(renderPlace)}</div>
                ) : <div className="text-gray-500 text-sm">No recommended places found.</div>}
              </div>
              <div>
                <h3 className="text-xl font-semibold my-4 text-gray-800">Top Hotels</h3>
                {topHotels.length > 0 ? (
                  <div className="flex overflow-x-auto pb-4">{topHotels.map(renderPlace)}</div>
                ) : <div className="text-gray-500 text-sm">No recommended hotels found.</div>}
              </div>
              <div>
                <h3 className="text-xl font-semibold my-4 text-gray-800">Top Food Places</h3>
                {topFood.length > 0 ? (
                  <div className="flex overflow-x-auto pb-4">{topFood.map(renderPlace)}</div>
                ) : <div className="text-gray-500 text-sm">No recommended food places found.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}