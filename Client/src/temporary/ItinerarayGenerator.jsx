// import { useState, useRef } from "react";
// import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
// import { useAuth } from "../context/authContext";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaPlaneDeparture,FaCar} from "react-icons/fa";
// import ItineraryDisplay from "./ItineraryDisplay";
// import { Button } from '../components/ui/button';
// import { useGoogleLogin } from "@react-oauth/google";
// import { setAccessToken, ensureTravelPlannerCalendar, insertEvent } from "../utils/googleCalendar";

// const PLACES_TYPES = ["museum", "art_gallery", "park", "tourist_attraction", "zoo", "aquarium", "landmark"];
// const HOTELS_TYPES = ["hotel", "motel", "lodging"];
// const FOOD_TYPES = ["restaurant", "cafe", "bakery", "bar"];
// const libraries = ["places"];

// export default function ItineraryGenerator() {
//   const [days, setDays] = useState(3);
//   const [importType, setImportType] = useState('intermediate');
//   const [itinerary, setItinerary] = useState(null);
//   const [topPlaces, setTopPlaces] = useState([]);
//   const [topHotels, setTopHotels] = useState([]);
//   const [topFood, setTopFood] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));

//   const destAutoRef = useRef(null);
//   const { user } = useAuth();

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // Google OAuth login
//   const login = useGoogleLogin({
//     scope: "https://www.googleapis.com/auth/calendar",
//     onSuccess: tokenResponse => {
//       setAccessToken(tokenResponse.access_token);
//       setIsConnectedToGoogle(true);
//       toast.success("Connected to Google Calendar!");
//     },
//     onError: err => {
//       console.error("Google login error:", err);
//       toast.error("Failed to connect Google account.");
//     },
//   });

//   // fetch places helper
//   const fetchPlaces = async (place, types, limit) => {
//     if (!place?.geometry) return [];
//     const { lat, lng } = place.geometry.location;
//     const bodyData = { destination: { lat: lat(), lon: lng() }, radius: 10000, types: types.join(","), limit };
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData),
//       });
//       const data = await res.json();
//       return Array.isArray(data) ? data.sort((a,b) => (b.reviews||0)-(a.reviews||0)) : [];
//     } catch (err) {
//       console.error("Fetch places error:", err);
//       return [];
//     }
//   };

//   const handlePlanTrip = async () => {
//     const place = destAutoRef.current?.getPlace();
//     if (!place?.geometry) { toast.error("Please select a valid destination."); return; }
//     setIsLoading(true);
//     setItinerary(null); setTopPlaces([]); setTopHotels([]); setTopFood([]);

//     const destination = { name: place.name, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

//     const planPromise = Promise.all([
//       fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${user.token}`, // Auth token is crucial
//         },
//         body: JSON.stringify({ destination, days,importType }),
//       }).then(res => {
//         if (!res.ok) throw new Error("Failed to generate itinerary.");
//         return res.json();
//       }),
//       fetchPlaces(place, PLACES_TYPES, 50),
//       fetchPlaces(place, HOTELS_TYPES, 50),
//       fetchPlaces(place, FOOD_TYPES, 50),
//     ]);

//     toast.promise(planPromise, {
//       loading: 'Planning your adventure...',
//       success: ([itineraryData, places, hotels, food]) => {
//         setItinerary(itineraryData.itinerary);
//         setTopPlaces(places.slice(0,15));
//         setTopHotels(hotels.slice(0,15));
//         setTopFood(food.slice(0,15));
//         setIsLoading(false);
//         return 'Your trip is ready!';
//       },
//       error: (err) => { console.error(err); setIsLoading(false); return `Error: ${err.message}`; },
//     });
//   };

//   const handleSaveItinerary = async () => {
//     if (!itinerary || !user) return;
//     const place = destAutoRef.current?.getPlace();
//     if (!place) return;

//     setIsSaving(true);
//     const savePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user.token}` },
//       body: JSON.stringify({ destinationName: place.name, itineraryData: itinerary }),
//     }).then(res => { if(!res.ok) throw new Error("Failed to save itinerary."); return res.json(); });

//     toast.promise(savePromise, {
//       loading: 'Saving to My Trips...',
//       success: 'Itinerary saved successfully!',
//       error: 'There was an error saving your itinerary.',
//     });
//     setIsSaving(false);
//   };

//   const handleSyncToCalendar = async () => {
//     if (!itinerary) { toast.error("Generate an itinerary first."); return; }
//     if (!isConnectedToGoogle) { toast.error("Connect your Google account first."); return; }

//     setSyncing(true);
//     toast.loading("Creating calendar & adding events...", { id: "sync" });

//     try {
//       const calendarId = await ensureTravelPlannerCalendar();
//       const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
//       const base = new Date(startDate + "T00:00:00");
//       if (isNaN(base.getTime())) throw new Error("Invalid start date");

//       const created = [];
//       for (const day of itinerary) {
//         const dayIndex = (day.day_number||1)-1;

//         const times = [
//           [9,12],
//           [13,17],
//           [19,21]
//         ].map(([startH,endH])=>{
//           const start = new Date(base); start.setDate(base.getDate()+dayIndex); start.setHours(startH,0,0,0);
//           const end = new Date(start); end.setHours(endH,0,0,0);
//           return [start,end];
//         });

//         const dayDescription = `
// Stay: ${day.stay_at}
// Meals:
//  - Breakfast: ${day.meals?.breakfast?.name || "—"}
//  - Lunch: ${day.meals?.lunch?.name || "—"}
//  - Dinner: ${day.meals?.dinner?.name || "—"}

// Morning Visits:
// ${(day.morning_visits||[]).map(v=>` - ${v.name}: ${v.description}`).join("\n")}

// Afternoon Visits:
// ${(day.afternoon_visits||[]).map(v=>` - ${v.name}: ${v.description}`).join("\n")}

// Evening Activity:
// ${day.evening_activity||"—"}
//         `.trim();

//         const events = times.map(([start,end], idx)=>({
//           summary: `Day ${day.day_number} — ${["Morning Plan","Afternoon Plan","Evening Activity"][idx]} (${day.stay_at})`,
//           description: dayDescription,
//           start: { dateTime: start.toISOString(), timeZone },
//           end: { dateTime: end.toISOString(), timeZone },
//           reminders: { useDefault:false, overrides:[{method:"popup",minutes:60},{method:"email",minutes:24*60}] },
//         }));

//         for (const ev of events) { const resp = await insertEvent(calendarId, ev); created.push(resp); await new Promise(r=>setTimeout(r,200)); }
//       }

//       toast.success(`Created ${created.length} events in 'Travel Planner'`, { id: "sync" });
//     } catch (err) {
//       console.error("Sync error:", err);
//       toast.error("Failed to sync to Google Calendar. See console.", { id: "sync" });
//     } finally {
//       setSyncing(false);
//     }
//   };

//   const renderPlace = (p,i) => (
//     <div key={i} className="p-3 mb-2 rounded-md border bg-white transition flex-shrink-0 w-72 mr-4 hover:shadow-md">
//       <div className="font-semibold text-gray-800 truncate">{p.name}</div>
//       <div className="text-sm text-gray-600 truncate">{p.address}</div>
//       <div className="text-sm text-yellow-600 my-1">⭐ {p.rating||"N/A"} ({p.reviews||0} reviews)</div>
//       {p.photo && <img src={p.photo} alt={p.name} className="mt-2 w-full h-40 object-cover rounded-md border" />}
//       <button onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.address}`)}`,"_blank")}
//         className="mt-3 w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition">
//         View in Maps
//       </button>
//     </div>
//   );

//   if (!isLoaded) return <div className="text-center p-10">Loading Google Maps...</div>;
//   if (!user) return (
//     <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="text-center bg-white p-10 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
//         <p className="text-gray-600 mb-6">Please log in to use the Trip Planner and save your trips.</p>
//         <Link to="/signin"><Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">Sign In</Button></Link>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
//       <div className="w-full max-w-6xl space-y-8">
//         <div className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl p-8 mb-6">
//           <div className="text-center space-y-2 mb-8">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
//               AI-Powered Trip Planner
//             </h1>
//             <p className="text-gray-700 text-lg">Craft your perfect journey in seconds.</p>
//           </div>

//             {/* Form Inputs Section */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
//                 {/* Destination Input */}
//                 <div className="md:col-span-3 space-y-2">
//                 <label className="font-medium text-gray-700 flex items-center gap-2">
//                     <FaMapMarkerAlt className="text-orange-500" />
//                     Destination
//                 </label>
//                 <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
//                     <input
//                     type="text"
//                     placeholder="Enter a city, e.g., Rome, Italy"
//                     className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
//                     />
//                 </Autocomplete>
//                 </div>

//                 {/* Number of Days Input */}
//                 <div className="md:col-span-2 space-y-2">
//                 <label className="font-medium text-gray-700 flex items-center gap-2">
//                     <FaCalendarAlt className="text-orange-500" />
//                     Duration
//                 </label>
//                 <select
//                     value={days}
//                     onChange={(e) => setDays(Number(e.target.value))}
//                     className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
//                 >
//                     {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} Day{d > 1 && 's'}</option>)}
//                 </select>
//                 </div>
//             </div>

//              {/* Travel Style Input */}
//                 <div className="space-y-2">
//                   <label className="font-medium text-gray-700 flex items-center gap-2">
//                       <FaCar className="text-orange-500" />
//                       Travel Style
//                   </label>
//                   <select
//                       value={importType}
//                       onChange={(e) => setImportType(e.target.value)}
//                       className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
//                   >
//                       <option value="cheap">Budget-Friendly</option>
//                       <option value="intermediate">Balanced</option>
//                       <option value="luxury">Luxury</option>
//                   </select>
//                 </div>
            

//           <div className="mt-8 flex flex-col sm:flex-row gap-4">
//             <button onClick={handlePlanTrip} disabled={isLoading} className="flex-grow w-full text-lg py-3 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
//               <FaPlaneDeparture/>{isLoading ? "Planning..." : "Plan My Trip"}
//             </button>
//             <Link to="/my-trips" className="w-full sm:w-auto">
//               <button className="w-full text-lg py-3 px-6 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
//                 <FaBookOpen/> My Trips
//               </button>
//             </Link>
//           </div>
//         </div>

//         {itinerary && (
//           <div className="space-y-8">
//             <div>
//               <ItineraryDisplay itinerary={itinerary} destinationName={destAutoRef.current?.getPlace()?.name||''}/>
//               <div className="bg-white p-8 rounded-b-lg shadow-lg -mt-2 space-y-3">
//                 <div className="grid md:grid-cols-3 gap-3">
//                   <button onClick={handleSaveItinerary} disabled={isSaving} className="col-span-2 w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-green-300">
//                     {isSaving ? "Saving..." : "Save This Itinerary to My Trips"}
//                   </button>
//                   <div className="flex gap-2">
//                     <button onClick={()=>login()} className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${isConnectedToGoogle?"opacity-80":""}`}>
//                       {isConnectedToGoogle ? "Google Connected" : "Connect Google Calendar"}
//                     </button>
//                     <button onClick={handleSyncToCalendar} disabled={syncing} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-60">
//                       {syncing ? "Syncing..." : "Sync to Travel Planner Calendar"}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-600">Note: Sync creates a dedicated calendar named <strong>Travel Planner</strong> and adds events there.</div>
//               </div>
//             </div>

//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Explore Your Destination</h2>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Places to Visit</h3>
//                 {topPlaces.length>0 ? <div className="flex overflow-x-auto pb-4">{topPlaces.map(renderPlace)}</div> : <div className="text-gray-500 text-sm">No recommended places found.</div>}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Hotels</h3>
//                 {topHotels.length>0 ? <div className="flex overflow-x-auto pb-4">{topHotels.map(renderPlace)}</div> : <div className="text-gray-500 text-sm">No recommended hotels found.</div>}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Food Places</h3>
//                 {topFood.length>0 ? <div className="flex overflow-x-auto pb-4">{topFood.map(renderPlace)}</div> : <div className="text-gray-500 text-sm">No recommended food places found.</div>}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// // src/components/ItineraryGenerator.jsx
// import { useState, useRef, useEffect } from "react";
// import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
// import { useAuth } from "../context/authContext";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaPlaneDeparture } from "react-icons/fa";

// import ItineraryDisplay from "./ItineraryDisplay";
// import { Button } from '../components/ui/button';

// import { initGoogleApi, signIn, isSignedIn, ensureTravelPlannerCalendar, insertEvent, signOut } from "../utils/googleCalendar";

// // Constants
// const PLACES_TYPES = ["museum", "art_gallery", "park", "tourist_attraction", "zoo", "aquarium", "landmark"];
// const HOTELS_TYPES = ["hotel", "motel", "lodging"];
// const FOOD_TYPES = ["restaurant", "cafe", "bakery", "bar"];
// const libraries = ["places"];

// export default function ItineraryGenerator() {
//   const [days, setDays] = useState(3);
//   const [itinerary, setItinerary] = useState(null);
//   const [topPlaces, setTopPlaces] = useState([]);
//   const [topHotels, setTopHotels] = useState([]);
//   const [topFood, setTopFood] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isCalendarReady, setIsCalendarReady] = useState(false);
//   const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [startDate, setStartDate] = useState(() => {
//     const d = new Date();
//     return d.toISOString().slice(0, 10); // YYYY-MM-DD
//   });

//   const destAutoRef = useRef(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   useEffect(() => {
//     // initialize gapi client in background, if env provided
//     const tryInit = async () => {
//       try {
//         await initGoogleApi();
//         setIsCalendarReady(true);
//         setIsConnectedToGoogle(isSignedIn());
//       } catch (err) {
//         console.info("Google init not ready:", err?.message);
//       }
//     };
//     tryInit();
//   }, []);

//   // fetchPlaces (unchanged)
//   const fetchPlaces = async (place, types, limit) => {
//     if (!place?.geometry) return [];
//     const { lat, lng } = place.geometry.location;
//     const bodyData = {
//       destination: { lat: lat(), lon: lng() },
//       radius: 10000,
//       types: types.join(","),
//       limit,
//     };
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData),
//       });
//       const data = await res.json();
//       return Array.isArray(data) ? data.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)) : [];
//     } catch (err) {
//       console.error("Fetch places error:", err);
//       return [];
//     }
//   };

//   // handlePlanTrip (unchanged)
//   const handlePlanTrip = async () => {
//     const place = destAutoRef.current?.getPlace();
//     if (!place?.geometry) {
//       toast.error("Please select a valid destination from the suggestions.");
//       return;
//     }
//     setIsLoading(true);
//     setItinerary(null);
//     setTopPlaces([]);
//     setTopHotels([]);
//     setTopFood([]);

//     const destination = {
//       name: place.name,
//       lat: place.geometry.location.lat(),
//       lng: place.geometry.location.lng(),
//     };

//     const planPromise = Promise.all([
//       fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({ destination, days }),
//       }).then(res => {
//         if (!res.ok) throw new Error("Failed to generate itinerary.");
//         return res.json();
//       }),
//       fetchPlaces(place, PLACES_TYPES, 50),
//       fetchPlaces(place, HOTELS_TYPES, 50),
//       fetchPlaces(place, FOOD_TYPES, 50),
//     ]);

//     toast.promise(planPromise, {
//       loading: 'Planning your adventure...',
//       success: ([itineraryData, places, hotels, food]) => {
//         setItinerary(itineraryData.itinerary);
//         setTopPlaces(places.slice(0, 15));
//         setTopHotels(hotels.slice(0, 15));
//         setTopFood(food.slice(0, 15));
//         setIsLoading(false);
//         return 'Your trip is ready!';
//       },
//       error: (err) => {
//         console.error("Trip planning error:", err);
//         setIsLoading(false);
//         return `Error: ${err.message}`;
//       },
//     });
//   };

//   // save itinerary (unchanged)
//   const handleSaveItinerary = async () => {
//     if (!itinerary || !user) return;
//     const place = destAutoRef.current?.getPlace();
//     if (!place) return;

//     setIsSaving(true);

//     const savePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/save`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${user.token}`,
//       },
//       body: JSON.stringify({
//         destinationName: place.name,
//         itineraryData: itinerary,
//       }),
//     }).then(res => {
//       if (!res.ok) throw new Error("Failed to save the itinerary.");
//       return res.json();
//     });

//     toast.promise(savePromise, {
//       loading: 'Saving to My Trips...',
//       success: 'Itinerary saved successfully!',
//       error: 'There was an error saving your itinerary.',
//     });

//     setIsSaving(false);
//   };

//   // Connect button (sign in)
//   const handleConnectGoogle = async () => {
//     try {
//       if (!isCalendarReady) {
//         await initGoogleApi();
//         setIsCalendarReady(true);
//       }
//       await signIn();
//       setIsConnectedToGoogle(true);
//       toast.success("Connected to Google.");
//     } catch (err) {
//       console.error("Google connect error:", err);
//       toast.error("Failed to connect Google account.");
//     }
//   };

//   // Sync to Google Calendar (creates Travel Planner calendar if needed)
//   const handleSyncToCalendar = async () => {
//     if (!itinerary) {
//       toast.error("Generate an itinerary first.");
//       return;
//     }
//     if (!isCalendarReady) {
//       try {
//         await initGoogleApi();
//         setIsCalendarReady(true);
//       } catch (err) {
//         toast.error("Google API initialization failed.");
//         return;
//       }
//     }
//     try {
//       await signIn();
//       setIsConnectedToGoogle(true);
//     } catch (err) {
//       toast.error("Google sign-in required.");
//       return;
//     }

//     setSyncing(true);
//     toast.loading("Creating calendar & adding events...", { id: "sync" });

//     try {
//       const calendarId = await ensureTravelPlannerCalendar();
//       // compute timezone
//       const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

//       // parse start date (YYYY-MM-DD)
//       const base = new Date(startDate + "T00:00:00");
//       if (isNaN(base.getTime())) throw new Error("Invalid start date");

//       // For each day, create 3 events: Morning, Afternoon, Evening
//       const created = [];
//       for (const day of itinerary) {
//         const dayIndex = (day.day_number || 1) - 1;
//         // morning: 09:00 - 12:00
//         const morningStart = new Date(base);
//         morningStart.setDate(base.getDate() + dayIndex);
//         morningStart.setHours(9, 0, 0, 0);
//         const morningEnd = new Date(morningStart);
//         morningEnd.setHours(12, 0, 0, 0);

//         const afternoonStart = new Date(base);
//         afternoonStart.setDate(base.getDate() + dayIndex);
//         afternoonStart.setHours(13, 0, 0, 0);
//         const afternoonEnd = new Date(afternoonStart);
//         afternoonEnd.setHours(17, 0, 0, 0);

//         const eveningStart = new Date(base);
//         eveningStart.setDate(base.getDate() + dayIndex);
//         eveningStart.setHours(19, 0, 0, 0);
//         const eveningEnd = new Date(eveningStart);
//         eveningEnd.setHours(21, 0, 0, 0);

//         const dayDescription = `
// Stay: ${day.stay_at}
// Meals:
//  - Breakfast: ${day.meals?.breakfast?.name || "—"}
//  - Lunch: ${day.meals?.lunch?.name || "—"}
//  - Dinner: ${day.meals?.dinner?.name || "—"}

// Morning Visits:
// ${(day.morning_visits || []).map(v => ` - ${v.name}: ${v.description}`).join("\n")}

// Afternoon Visits:
// ${(day.afternoon_visits || []).map(v => ` - ${v.name}: ${v.description}`).join("\n")}

// Evening Activity:
// ${day.evening_activity || "—"}
//         `.trim();

//         // Build three event objects
//         const events = [
//           {
//             summary: `Day ${day.day_number} — Morning Plan (${day.stay_at})`,
//             description: dayDescription,
//             start: { dateTime: morningStart.toISOString(), timeZone },
//             end: { dateTime: morningEnd.toISOString(), timeZone },
//             reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 60 }, { method: "email", minutes: 24 * 60 }] },
//           },
//           {
//             summary: `Day ${day.day_number} — Afternoon Plan (${day.stay_at})`,
//             description: dayDescription,
//             start: { dateTime: afternoonStart.toISOString(), timeZone },
//             end: { dateTime: afternoonEnd.toISOString(), timeZone },
//             reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 60 }] },
//           },
//           {
//             summary: `Day ${day.day_number} — Evening Activity (${day.stay_at})`,
//             description: dayDescription,
//             start: { dateTime: eveningStart.toISOString(), timeZone },
//             end: { dateTime: eveningEnd.toISOString(), timeZone },
//             reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
//           },
//         ];

//         // Insert sequentially to reduce quota/rate issues
//         for (const ev of events) {
//           const resp = await insertEvent(calendarId, ev);
//           created.push(resp.result);
//           // small delay to be gentle with API quotas (optional)
//           await new Promise((r) => setTimeout(r, 200));
//         }
//       }

//       toast.success(`Created ${created.length} events in 'Travel Planner'`, { id: "sync" });
//     } catch (err) {
//       console.error("Sync error:", err);
//       toast.error("Failed to sync to Google Calendar. See console for details.", { id: "sync" });
//     } finally {
//       setSyncing(false);
//     }
//   };

//   // renderPlace (unchanged)
//   const renderPlace = (p, i) => (
//     <div
//       key={i}
//       className="p-3 mb-2 rounded-md border bg-white transition flex-shrink-0 w-72 mr-4 hover:shadow-md"
//     >
//       <div className="font-semibold text-gray-800 truncate">{p.name}</div>
//       <div className="text-sm text-gray-600 truncate">{p.address}</div>
//       <div className="text-sm text-yellow-600 my-1">
//         ⭐ {p.rating || "N/A"} ({p.reviews || 0} reviews)
//       </div>
//       {p.photo && <img src={p.photo} alt={p.name} className="mt-2 w-full h-40 object-cover rounded-md border" />}
//       <button
//         onClick={() => {
//           const query = encodeURIComponent(`${p.name}, ${p.address}`);
//           const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
//           window.open(url, "_blank");
//         }}
//         className="mt-3 w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition"
//       >
//         View in Maps
//       </button>
//     </div>
//   );

//   if (!isLoaded) return <div className="text-center p-10">Loading Google Maps...</div>;

//   if (!user) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <div className="text-center bg-white p-10 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-6">Please log in to use the Trip Planner and save your trips.</p>
//           <Link to="/signin">
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">
//               Sign In
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
//       <div className="w-full max-w-6xl space-y-8">
//         <div className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl p-8 mb-6">
//           <div className="text-center space-y-2 mb-8">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
//               AI-Powered Trip Planner
//             </h1>
//             <p className="text-gray-700 text-lg">Craft your perfect journey in seconds.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
//             <div className="md:col-span-3 space-y-2">
//               <label className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-orange-500" />
//                 Destination
//               </label>
//               <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
//                 <input
//                   type="text"
//                   placeholder="Enter a city, e.g., Rome, Italy"
//                   className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
//                 />
//               </Autocomplete>
//             </div>

//             <div className="md:col-span-1 space-y-2">
//               <label className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaCalendarAlt className="text-orange-500" />
//                 Days
//               </label>
//               <select
//                 value={days}
//                 onChange={(e) => setDays(Number(e.target.value))}
//                 className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
//               >
//                 {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d}</option>)}
//               </select>
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <label className="font-medium text-gray-700">Trip Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full p-3 border border-orange-300 rounded-lg"
//               />
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handlePlanTrip}
//               disabled={isLoading}
//               className="flex-grow w-full text-lg py-3 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               <FaPlaneDeparture />
//               {isLoading ? "Planning..." : "Plan My Trip"}
//             </button>

//             <Link to="/my-trips" className="w-full sm:w-auto">
//               <button className="w-full text-lg py-3 px-6 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
//                 <FaBookOpen />
//                 My Trips
//               </button>
//             </Link>
//           </div>
//         </div>

//         {itinerary && (
//           <div className="space-y-8">
//             <div>
//               <ItineraryDisplay
//                 itinerary={itinerary}
//                 destinationName={destAutoRef.current?.getPlace()?.name || ''}
//               />
//               <div className="bg-white p-8 rounded-b-lg shadow-lg -mt-2 space-y-3">
//                 <div className="grid md:grid-cols-3 gap-3">
//                   <button
//                     onClick={handleSaveItinerary}
//                     disabled={isSaving}
//                     className="col-span-2 w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-green-300"
//                   >
//                     {isSaving ? "Saving..." : "Save This Itinerary to My Trips"}
//                   </button>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleConnectGoogle}
//                       className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${isConnectedToGoogle ? "opacity-80" : ""}`}
//                     >
//                       {isConnectedToGoogle ? "Google Connected" : "Connect Google Calendar"}
//                     </button>

//                     <button
//                       onClick={handleSyncToCalendar}
//                       disabled={syncing}
//                       className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
//                     >
//                       {syncing ? "Syncing..." : "Sync to Travel Planner Calendar"}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-600">
//                   Note: Sync creates a dedicated calendar named <strong>Travel Planner</strong> and adds events there.
//                 </div>
//               </div>
//             </div>

//             {/* Places explorer (unchanged) */}
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Explore Your Destination</h2>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Places to Visit</h3>
//                 {topPlaces.length > 0 ? (
//                   <div className="flex overflow-x-auto pb-4">{topPlaces.map(renderPlace)}</div>
//                 ) : <div className="text-gray-500 text-sm">No recommended places found.</div>}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Hotels</h3>
//                 {topHotels.length > 0 ? (
//                   <div className="flex overflow-x-auto pb-4">{topHotels.map(renderPlace)}</div>
//                 ) : <div className="text-gray-500 text-sm">No recommended hotels found.</div>}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold my-4 text-gray-800">Top Food Places</h3>
//                 {topFood.length > 0 ? (
//                   <div className="flex overflow-x-auto pb-4">{topFood.map(renderPlace)}</div>
//                 ) : <div className="text-gray-500 text-sm">No recommended food places found.</div>}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaPlaneDeparture,FaCar} from "react-icons/fa"
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
  const [importType, setImportType] = useState('intermediate');
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
        body: JSON.stringify({ destination, days,importType }),
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

             {/* Travel Style Input */}
                <div className="space-y-2">
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                      <FaCar className="text-orange-500" />
                      Travel Style
                  </label>
                  <select
                      value={importType}
                      onChange={(e) => setImportType(e.target.value)}
                      className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  >
                      <option value="cheap">Budget-Friendly</option>
                      <option value="intermediate">Balanced</option>
                      <option value="luxury">Luxury</option>
                  </select>
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