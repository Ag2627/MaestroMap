// // src/pages/HotelPage.jsx
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";

// const MAP_CONTAINER = { width: "100%", height: "500px" };

// const GOOGLE_TYPES = [
//   "restaurant",          // general restaurants
//   "cafe",                // casual coffee/tea places
//   "bar",                 // bars and pubs
//   "bakery",              // bakeries and pastry shops
//   "meal_delivery",       // places that deliver food
//   "meal_takeaway",       // takeaway/fast food
//   "food",                // general food locations
//   "fine_dining",         // high-end restaurants
//   "fast_food",           // quick-service restaurants
//   "pub",                 // pubs serving food & drinks
// ];

// export default function HotelPage() {
//   const [placeSelected, setPlaceSelected] = useState(null);
//   const [hotels, setHotels] = useState([]);
//   const [mapCenter, setMapCenter] = useState(null);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [radius, setRadius] = useState(10000); // 10 km default

//   const autocompleteRef = useRef(null);
//   const mapRef = useRef(null);
//   const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//   const apiBase = import.meta.env.VITE_API_BASE_URL;

//   // ----------------- Autocomplete -----------------
//   const onAutoLoad = (autocomplete) => {
//     autocompleteRef.current = autocomplete;
//   };

//   const onAutoPlaceChanged = () => {
//     const auto = autocompleteRef.current;
//     if (!auto) return;
//     const place = auto.getPlace();
//     if (!place || !place.geometry) {
//       setPlaceSelected(null);
//       setError("Please select a valid place from suggestions.");
//       return;
//     }
//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();
//     setPlaceSelected({
//       name: place.name || place.formatted_address,
//       address: place.formatted_address || "",
//       lat,
//       lng,
//     });
//     setError(null);
//   };

//   // ----------------- Search Hotels -----------------
//   const handleSearchHotels = async () => {
//     if (!placeSelected?.lat || !placeSelected?.lng) {
//       setError("Please select a destination first.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setHotels([]);
//     setSelectedHotel(null);

//     try {
//       const body = {
//         destination: { lat: placeSelected.lat, lon: placeSelected.lng },
//         radius,
//         types: ["lodging"], // Google Places type
//         limit: 50,
//          // ensure we get hotels
//       };

//       const res = await axios.post(`${apiBase}/trip/googleplaces`, body, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!Array.isArray(res.data)) {
//         console.warn("Unexpected server response:", res.data);
//         setError("Unexpected server response from backend");
//         return;
//       }

//       const normalized = res.data
//         .map((p) => {
//           const lat = Number(p.location?.lat ?? NaN);
//           const lng = Number(p.location?.lng ?? NaN);
//           if (isNaN(lat) || isNaN(lng)) return null;
//           return { ...p, location: { lat, lng }, photo: p.photo ?? null };
//         })
//         .filter(Boolean);

//       if (normalized.length === 0) setError("No hotels found nearby.");

//       setHotels(normalized);
//       setMapCenter({ lat: placeSelected.lat, lng: placeSelected.lng });

//       // fit map bounds
//       if (mapRef.current && normalized.length > 0) {
//         const bounds = new window.google.maps.LatLngBounds();
//         normalized.forEach((h) => bounds.extend(h.location));
//         bounds.extend({ lat: placeSelected.lat, lng: placeSelected.lng });
//         mapRef.current.fitBounds(bounds);
//       }
//     } catch (err) {
//       console.error("Error fetching hotels:", err);
//       setError("Failed to fetch hotels. Check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHotelClick = (hotel) => {
//     setSelectedHotel(hotel);
//     if (mapRef.current) {
//       mapRef.current.panTo(hotel.location);
//       mapRef.current.setZoom(15);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 to-amber-100">
//       <div className="w-full max-w-4xl space-y-6">
//         {/* Search Card */}
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-xl">Find Top Hotels</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <LoadScript googleMapsApiKey={googleKey} libraries={["places"]}>
//               <div className="grid md:grid-cols-3 gap-4 items-end">
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Destination (select suggestion)
//                   </label>
//                   <Autocomplete onLoad={onAutoLoad} onPlaceChanged={onAutoPlaceChanged}>
//                     <input
//                       placeholder="Type a city or place and choose suggestion"
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </Autocomplete>
//                   {placeSelected && (
//                     <div className="text-sm text-gray-600 mt-2">
//                       Selected: <strong>{placeSelected.name}</strong> — {placeSelected.address}
//                     </div>
//                   )}
//                   <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Radius (meters)</label>
//                   <input
//                     type="number"
//                     value={radius}
//                     onChange={(e) => setRadius(Number(e.target.value))}
//                     className="w-32 p-2 border rounded-md"
//                   />
//                 </div>

//                 <div className="col-span-1">
//                   <button
//                     onClick={handleSearchHotels}
//                     className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     disabled={loading}
//                   >
//                     {loading ? "Searching..." : "Search Hotels"}
//                   </button>
//                 </div>
//               </div>
//             </LoadScript>
//           </CardContent>
//         </Card>

//         {error && <div className="text-center text-red-600">{error}</div>}

//         {/* Results List + Map */}
//         {mapCenter && hotels.length > 0 && (
//           <LoadScript googleMapsApiKey={googleKey}>
//             <div className="grid md:grid-cols-2 gap-4 w-full max-w-6xl">
//               {/* Sidebar List */}
//               <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
//                 {hotels.map((h, i) => (
//                   <div
//                     key={i}
//                     className="p-3 border rounded-md cursor-pointer hover:shadow-md flex gap-3"
//                     onClick={() => handleHotelClick(h)}
//                   >
//                     <img
//                       src={h.photo || "https://via.placeholder.com/160x100?text=No+Image"}
//                       alt={h.name}
//                       className="w-40 h-24 object-cover rounded-sm"
//                     />
//                     <div className="flex-1">
//                       <div className="font-semibold">{h.name}</div>
//                       <div className="text-sm text-gray-600">{h.address}</div>
//                       <div className="text-sm text-yellow-600">
//                         ⭐ {h.rating || "N/A"} ({h.reviews || 0})
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Map */}
//               <div>
//                 <GoogleMap mapContainerStyle={MAP_CONTAINER} center={mapCenter} zoom={13} onLoad={(map) => (mapRef.current = map)}>
//                   {hotels.map((h, idx) => (
//                     <Marker key={idx} position={h.location} onClick={() => setSelectedHotel(h)} />
//                   ))}

//                   {selectedHotel && (
//                     <InfoWindow
//                       position={selectedHotel.location}
//                       onCloseClick={() => setSelectedHotel(null)}
//                     >
//                       <div className="max-w-xs">
//                         <strong className="block">{selectedHotel.name}</strong>
//                         <div className="text-sm text-gray-600">{selectedHotel.address}</div>
//                         <div className="text-sm">⭐ {selectedHotel.rating || "N/A"}</div>
//                         {selectedHotel.photo && <img src={selectedHotel.photo} alt={selectedHotel.name} className="mt-2 w-full rounded-md" />}
//                         <a
//                           href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.address)}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         >
//                           View in Maps
//                         </a>
//                       </div>
//                     </InfoWindow>
//                   )}
//                 </GoogleMap>
//               </div>
//             </div>
//           </LoadScript>
//         )}
//       </div>
//     </div>
//   );
// }


// // import { useState, useRef } from "react";
// // import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from "@react-google-maps/api";

// // const containerStyle = { width: "100%", height: "100%" };
// // const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

// // export default function Hotels() {
// //   const [destLatLng, setDestLatLng] = useState(null);
// //   const [hotels, setHotels] = useState([]);
// //   const [radius, setRadius] = useState(5000);
// //   const [selectedHotel, setSelectedHotel] = useState(null);

// //   const destAutoRef = useRef(null);
// //   const mapRef = useRef(null);

// //   const { isLoaded } = useJsApiLoader({
// //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
// //     libraries: ["places"],
// //   });

// //   const handleSearch = async () => {
// //     const place = destAutoRef.current?.getPlace();
// //     if (!place?.geometry) {
// //       alert("Select a valid destination from autocomplete");
// //       return;
// //     }

// //     const lat = place.geometry.location.lat();
// //     const lon = place.geometry.location.lng();
// //     setDestLatLng({ lat, lng: lon });
// //     setSelectedHotel(null);

// //     const bodyData = {
// //       destination: { lat, lon },
// //       radius: Number(radius),
// //       types: ["hotel"], // ✅ only hotels
// //       limit: 10, // top 10 hotels
// //       keyword: "hotel",
// //     };

// //     try {
// //       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(bodyData),
// //       });

// //       const data = await res.json();
// //       if (!Array.isArray(data)) {
// //         alert("Unexpected response from server");
// //         setHotels([]);
// //         return;
// //       }

// //       const formatted = data
// //         .map((p) => {
// //           if (!p.location || !p.address) return null;
// //           const plat = Number(p.location.lat);
// //           const plon = Number(p.location.lng);
// //           if (Number.isNaN(plat) || Number.isNaN(plon)) return null;
// //           return { ...p, location: { lat: plat, lng: plon }, photo: p.photo ?? null };
// //         })
// //         .filter(Boolean)
// //         .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // sort by rating
// //         .slice(0, 10); // top 10

// //       setHotels(formatted);

// //       // Fit map bounds
// //       if (mapRef.current && formatted.length > 0) {
// //         const bounds = new window.google.maps.LatLngBounds();
// //         formatted.forEach((h) => bounds.extend(h.location));
// //         bounds.extend({ lat, lng: lon });
// //         mapRef.current.fitBounds(bounds);
// //       }
// //     } catch (err) {
// //       console.error("Fetch error:", err);
// //       setHotels([]);
// //     }
// //   };

// //   const handleHotelClick = (hotel) => {
// //     setSelectedHotel(hotel);
// //     if (mapRef.current) {
// //       mapRef.current.panTo(hotel.location);
// //       mapRef.current.setZoom(15);
// //     }
// //   };

// //   if (!isLoaded) return <div>Loading...</div>;

// //   return (
// //     <div className="flex h-screen">
// //       {/* Sidebar */}
// //       <div className="w-80 p-4 border-r overflow-y-auto bg-gray-50">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Top Hotels</h2>

// //         {destLatLng && (
// //           <div className="text-sm text-gray-600 mb-3">
// //             {destAutoRef.current?.getPlace()?.formatted_address || "Selected Location"}
// //           </div>
// //         )}

// //         <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
// //         <input
// //           type="number"
// //           value={radius}
// //           onChange={(e) => setRadius(e.target.value)}
// //           className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //         />

// //         <Autocomplete onLoad={(auto) => (destAutoRef.current = auto)}>
// //           <input
// //             type="text"
// //             placeholder="Enter destination (select suggestion)"
// //             className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //         </Autocomplete>

// //         <button
// //           onClick={handleSearch}
// //           className="w-full py-2 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
// //         >
// //           Find Hotels
// //         </button>

// //         {/* Sidebar list */}
// //         <div>
// //           {hotels.length === 0 && <div className="text-gray-500 text-sm">No hotels yet</div>}
// //           {hotels.map((h, i) => (
// //             <div
// //               key={i}
// //               onClick={() => handleHotelClick(h)}
// //               className={`p-3 mb-2 rounded-md cursor-pointer transition ${
// //                 selectedHotel === h ? "bg-blue-100" : "hover:bg-gray-100"
// //               }`}
// //             >
// //               <div className="font-semibold text-gray-800">{h.name}</div>
// //               <div className="text-sm text-gray-600">{h.address}</div>
// //               <div className="text-sm text-yellow-600">
// //                 ⭐ {h.rating || "N/A"} ({h.reviews || 0} reviews)
// //               </div>
// //               {h.photo && <img src={h.photo} alt={h.name} className="mt-2 w-full rounded-md border" />}
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Map */}
// //       <div className="flex-1">
// //         <GoogleMap
// //           mapContainerStyle={containerStyle}
// //           center={destLatLng || defaultCenter}
// //           zoom={destLatLng ? 12 : 5}
// //           onLoad={(map) => (mapRef.current = map)}
// //         >
// //           {destLatLng && (
// //             <Marker position={destLatLng} label={{ text: `Radius: ${radius} m`, fontWeight: "bold", fontSize: "12px", color: "#1976d2" }} />
// //           )}

// //           {hotels.map((h, idx) => (
// //             <Marker key={idx} position={h.location} onClick={() => setSelectedHotel(h)} title={h.name} />
// //           ))}

// //           {selectedHotel && (
// //             <InfoWindow position={selectedHotel.location} onCloseClick={() => setSelectedHotel(null)}>
// //               <div className="max-w-xs">
// //                 <strong className="block text-gray-800">{selectedHotel.name}</strong>
// //                 <div className="text-sm text-gray-600">{selectedHotel.address}</div>
// //                 <div className="text-sm text-yellow-600">
// //                   ⭐ {selectedHotel.rating || "N/A"} ({selectedHotel.reviews || 0} reviews)
// //                 </div>
// //                 {selectedHotel.photo && <img src={selectedHotel.photo} alt={selectedHotel.name} className="mt-2 w-full rounded-md" />}
// //                 <a
// //                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.address)}`}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //                 >
// //                   View in Maps
// //                 </a>
// //               </div>
// //             </InfoWindow>
// //           )}
// //         </GoogleMap>
// //       </div>
// //     </div>
// //   );
// // }


// src/pages/HotelPage.jsx
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";

// const MAP_CONTAINER = { width: "100%", height: "500px" };

// export default function HotelPage() {
//   const [placeSelected, setPlaceSelected] = useState(null);
//   const [hotels, setHotels] = useState([]);
//   const [mapCenter, setMapCenter] = useState(null);
//   const [selectedHotel, setSelectedHotel] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [radius, setRadius] = useState(10000);

//   const autocompleteRef = useRef(null);
//   const mapRef = useRef(null);

//   const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//   const apiBase = import.meta.env.VITE_API_BASE_URL;

//   // Autocomplete
//   const onAutoLoad = (autocomplete) => (autocompleteRef.current = autocomplete);
//   const onAutoPlaceChanged = () => {
//     const auto = autocompleteRef.current;
//     if (!auto) return;
//     const place = auto.getPlace();
//     if (!place || !place.geometry) {
//       setPlaceSelected(null);
//       setError("Select a valid place from suggestions.");
//       return;
//     }
//     setPlaceSelected({
//       name: place.name || place.formatted_address,
//       address: place.formatted_address || "",
//       lat: place.geometry.location.lat(),
//       lng: place.geometry.location.lng(),
//     });
//     setError(null);
//   };

//   // Fetch hotels
//   const handleSearchHotels = async () => {
//     if (!placeSelected?.lat || !placeSelected?.lng) {
//       setError("Select a destination first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setHotels([]);
//     setSelectedHotel(null);

//     try {
//       const body = { destination: { lat: placeSelected.lat, lon: placeSelected.lng }, radius, types: ["lodging"], limit: 50 };
//       const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, body, { headers: { "Content-Type": "application/json" } });

//       if (!Array.isArray(res.data)) {
//         setError("Unexpected response from server");
//         return;
//       }

//       const formatted = res.data
//         .map((p) => {
//           const lat = Number(p.location?.lat ?? NaN);
//           const lng = Number(p.location?.lng ?? NaN);
//           if (isNaN(lat) || isNaN(lng)) return null;
//           return { ...p, location: { lat, lng }, photo: p.photo ?? null };
//         })
//         .filter(Boolean);

//       if (!formatted.length) setError("No hotels found nearby.");

//       setHotels(formatted);
//       setMapCenter({ lat: placeSelected.lat, lng: placeSelected.lng });

//       // Fit bounds
//       if (mapRef.current && formatted.length) {
//         const bounds = new window.google.maps.LatLngBounds();
//         formatted.forEach((h) => bounds.extend(h.location));
//         bounds.extend({ lat: placeSelected.lat, lng: placeSelected.lng });
//         mapRef.current.fitBounds(bounds);
//       }
//     } catch (err) {
//       console.error("Error fetching hotels:", err);
//       setError("Failed to fetch hotels. Check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHotelClick = (hotel) => {
//     setSelectedHotel(hotel);
//     if (mapRef.current) {
//       mapRef.current.panTo(hotel.location);
//       mapRef.current.setZoom(15);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 to-amber-100">
//       <div className="w-full max-w-5xl space-y-6">
//         {/* Search Form */}
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-xl">Search Hotels</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <LoadScript googleMapsApiKey={googleKey} libraries={["places"]}>
//               <div className="grid md:grid-cols-3 gap-4 items-end">
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                   <Autocomplete onLoad={onAutoLoad} onPlaceChanged={onAutoPlaceChanged}>
//                     <input
//                       type="text"
//                       placeholder="Enter city or place"
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </Autocomplete>
//                   {placeSelected && (
//                     <div className="text-sm text-gray-600 mt-2">
//                       Selected: <strong>{placeSelected.name}</strong> — {placeSelected.address}
//                     </div>
//                   )}
//                   <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Radius (meters)</label>
//                   <input
//                     type="number"
//                     value={radius}
//                     onChange={(e) => setRadius(Number(e.target.value))}
//                     className="w-32 p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="col-span-1">
//                   <button
//                     onClick={handleSearchHotels}
//                     className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     disabled={loading}
//                   >
//                     {loading ? "Searching..." : "Search Hotels"}
//                   </button>
//                 </div>
//               </div>
//             </LoadScript>
//           </CardContent>
//         </Card>

//         {error && <div className="text-center text-red-600">{error}</div>}

//         {/* Hotels List + Map */}
//         {mapCenter && hotels.length > 0 && (
//           <LoadScript googleMapsApiKey={googleKey}>
//             <div className="grid md:grid-cols-2 gap-4 w-full max-w-6xl">
//               {/* Sidebar */}
//               <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
//                 {hotels.map((h, i) => (
//                   <div
//                     key={i}
//                     onClick={() => handleHotelClick(h)}
//                     className="p-3 border rounded-md cursor-pointer hover:shadow-lg flex gap-3 transition duration-200 bg-white"
//                   >
//                     <img
//                       src={h.photo || "https://via.placeholder.com/160x100?text=No+Image"}
//                       alt={h.name}
//                       className="w-40 h-24 object-cover rounded-md"
//                     />
//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <div className="font-semibold text-gray-800">{h.name}</div>
//                         <div className="text-sm text-gray-600">{h.address}</div>
//                       </div>
//                       <div className="flex items-center justify-between mt-1">
//                         <div className="text-sm text-yellow-600">⭐ {h.rating || "N/A"} ({h.reviews || 0})</div>
//                         <a
//                           href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.address)}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
//                         >
//                           View in Maps
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Map */}
//               <div>
//                 <GoogleMap
//                   mapContainerStyle={MAP_CONTAINER}
//                   center={mapCenter}
//                   zoom={13}
//                   onLoad={(map) => (mapRef.current = map)}
//                 >
//                   {hotels.map((h, idx) => (
//                     <Marker key={idx} position={h.location} onClick={() => setSelectedHotel(h)} />
//                   ))}

//                   {selectedHotel && (
//                     <InfoWindow position={selectedHotel.location} onCloseClick={() => setSelectedHotel(null)}>
//                       <div className="max-w-xs">
//                         <strong className="block">{selectedHotel.name}</strong>
//                         <div className="text-sm text-gray-600">{selectedHotel.address}</div>
//                         <div className="text-sm text-yellow-600">
//                           ⭐ {selectedHotel.rating || "N/A"} ({selectedHotel.reviews || 0} reviews)
//                         </div>
//                         {selectedHotel.photo && <img src={selectedHotel.photo} alt={selectedHotel.name} className="mt-2 w-full rounded-md" />}
//                         <a
//                           href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.address)}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         >
//                           View in Maps
//                         </a>
//                       </div>
//                     </InfoWindow>
//                   )}
//                 </GoogleMap>
//               </div>
//             </div>
//           </LoadScript>
//         )}
//       </div>
//     </div>
//   );
// }

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from "@react-google-maps/api";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const MAP_CONTAINER = { width: "100%", height: "500px" };

export function HotelsFormPage({ title, description, buttonText }) {
  const [destination, setDestination] = React.useState("");
  const [startDate, setStartDate] = React.useState(undefined);
  const [endDate, setEndDate] = React.useState(undefined);
  const [destLatLng, setDestLatLng] = React.useState(null);
  const [radius, setRadius] = React.useState(5000);
  const [hotels, setHotels] = React.useState([]);
  const [selectedHotel, setSelectedHotel] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const autocompleteRef = React.useRef(null);
  const mapRef = React.useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Autocomplete
  const onLoadAutocomplete = (auto) => { autocompleteRef.current = auto; };
  const onPlaceChanged = () => {
    const auto = autocompleteRef.current;
    if (!auto) return;
    const place = auto.getPlace();
    if (!place?.geometry) {
      setError("Select a valid destination from suggestions.");
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setDestLatLng({ lat, lng });
    setDestination(place.formatted_address || place.name || "");
    setError(null);
    setHotels([]);
    setSelectedHotel(null);
  };

  // Search hotels
  const searchHotels = async () => {
    if (!destLatLng) {
      setError("Select a valid destination first.");
      return;
    }
    setLoading(true);
    setError(null);
    setHotels([]);
    setSelectedHotel(null);

    try {
      const body = {
        destination: { lat: destLatLng.lat, lon: destLatLng.lng },
        radius,
        types: ["lodging"],
        limit: 30,
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError("No hotels found nearby.");
        return;
      }

      const formatted = data
        .map(h => {
          if (!h.location?.lat || !h.location?.lng) return null;
          return { ...h, location: { lat: Number(h.location.lat), lng: Number(h.location.lng) } };
        })
        .filter(Boolean)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setHotels(formatted);

      if (mapRef.current && formatted.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        formatted.forEach(h => bounds.extend(h.location));
        bounds.extend(destLatLng);
        mapRef.current.fitBounds(bounds);
      }

    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to fetch hotels.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchHotels();
  };

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
    if (mapRef.current) {
      mapRef.current.panTo(hotel.location);
      mapRef.current.setZoom(16);
    }
  };

  return (
    <Card className="w-full max-w-5xl shadow-lg bg-white/80 backdrop-blur-sm mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {/* Destination */}
          <div className="grid gap-2">
            <Label>Destination</Label>
            {isLoaded ? (
  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
    <Input
      placeholder="e.g., Goa, India"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      required
    />
  </Autocomplete>
) : (
  <Input placeholder="Loading Google Maps..." disabled />
)}
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "LLL dd, y") : "Pick a start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "LLL dd, y") : "Pick an end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={{ before: startDate || new Date(0) }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Radius */}
          <div className="grid gap-2">
            <Label>Radius (meters)</Label>
            <Input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
          </div>

          {error && <div className="text-red-600">{error}</div>}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700">
            <Search className="mr-2 h-4 w-4" /> {buttonText}
          </Button>
        </CardFooter>
      </form>

      {/* Horizontal hotel list + Map */}
      <div className="flex flex-col mt-4 gap-4">
        <div className="flex overflow-x-auto gap-4 py-2 px-1 border-b">
          {hotels.length === 0 && <div className="text-gray-500 text-sm">No hotels yet</div>}
          {hotels.map((h, i) => (
            <div
              key={i}
              onClick={() => handleHotelClick(h)}
              className={`min-w-[200px] p-2 rounded-md cursor-pointer border transition ${selectedHotel === h ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"}`}
            >
              {h.photo && <img src={h.photo} alt={h.name} className="w-full h-28 object-cover rounded-md mb-2" />}
              <div className="font-semibold text-sm">{h.name}</div>
              <div className="text-xs text-gray-600">{h.address}</div>
            </div>
          ))}
        </div>

        <div className="flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER}
              center={selectedHotel ? selectedHotel.location : destLatLng || { lat: 20.5937, lng: 78.9629 }}
              zoom={selectedHotel ? 16 : 5}
              onLoad={(map) => (mapRef.current = map)}
            >
              {destLatLng && !selectedHotel && (
                <Marker
                  position={destLatLng}
                  label={{ text: `Radius: ${radius} m`, fontWeight: "bold", fontSize: "12px", color: "#1976d2" }}
                />
              )}

              {hotels.map((h, i) => (
                <Marker key={i} position={h.location} onClick={() => setSelectedHotel(h)} title={h.name} />
              ))}

              {selectedHotel && (
                <InfoWindow position={selectedHotel.location} onCloseClick={() => setSelectedHotel(null)}>
                  <div className="max-w-xs">
                    <strong className="block">{selectedHotel.name}</strong>
                    <div className="text-sm text-gray-600">{selectedHotel.address}</div>
                    <div className="text-sm text-yellow-600">⭐ {selectedHotel.rating || "N/A"} ({selectedHotel.reviews || 0})</div>
                    {selectedHotel.photo && <img src={selectedHotel.photo} alt={selectedHotel.name} className="mt-2 w-full rounded-md" />}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View in Maps
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
      </div>
    </Card>
  );
} 




// // src/components/HotelsFormPage.jsx
// import * as React from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon, Search } from "lucide-react";
// import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from "@react-google-maps/api";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// const MAP_CONTAINER = { width: "100%", height: "500px" };

// export function HotelsFormPage({ title, description, buttonText }) {
//   const [destination, setDestination] = React.useState("");
//   const [startDate, setStartDate] = React.useState(undefined);
//   const [endDate, setEndDate] = React.useState(undefined);
//   const [destLatLng, setDestLatLng] = React.useState(null);
//   const [radius, setRadius] = React.useState(5000);
//   const [hotels, setHotels] = React.useState([]);
//   const [selectedHotel, setSelectedHotel] = React.useState(null);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);

//   const autocompleteRef = React.useRef(null);
//   const mapRef = React.useRef(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   const onLoadAutocomplete = (auto) => {
//     autocompleteRef.current = auto;
//   };

//   const onPlaceChanged = () => {
//     const auto = autocompleteRef.current;
//     if (!auto) return;
//     const place = auto.getPlace();
//     if (!place?.geometry) {
//       setError("Select a valid destination from suggestions.");
//       return;
//     }
//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();
//     setDestLatLng({ lat, lng });
//     setDestination(place.formatted_address || place.name || "");
//     setError(null);
//     setHotels([]);
//     setSelectedHotel(null);
//   };

//   const searchHotels = async () => {
//     if (!destLatLng) {
//       setError("Select a valid destination first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setHotels([]);
//     setSelectedHotel(null);

//     try {
//       const body = {
//         destination: { lat: destLatLng.lat, lon: destLatLng.lng },
//         radius,
//         types: ["lodging"],
//         limit: 30,
//       };

//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/googleplaces`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!Array.isArray(data) || data.length === 0) {
//         setError("No hotels found nearby.");
//         return;
//       }

//       const formatted = data
//         .map(h => h.location?.lat && h.location?.lng ? { ...h, location: { lat: Number(h.location.lat), lng: Number(h.location.lng) } } : null)
//         .filter(Boolean)
//         .sort((a, b) => (b.rating || 0) - (a.rating || 0));

//       setHotels(formatted);

//       if (mapRef.current && formatted.length > 0) {
//         const bounds = new window.google.maps.LatLngBounds();
//         formatted.forEach(h => bounds.extend(h.location));
//         bounds.extend(destLatLng);
//         mapRef.current.fitBounds(bounds);
//       }

//     } catch (err) {
//       console.error("Error fetching hotels:", err);
//       setError("Failed to fetch hotels.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     searchHotels();
//   };

//   const handleHotelClick = (hotel) => {
//     setSelectedHotel(hotel);
//     if (mapRef.current) {
//       mapRef.current.panTo(hotel.location);
//       mapRef.current.setZoom(16);
//     }
//   };

//   if (!isLoaded) return <div>Loading Maps...</div>;

//   return (
//     <Card className="w-full max-w-4xl shadow-lg bg-white/80 backdrop-blur-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-slate-800">{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="grid gap-4">
//           <div className="grid gap-2">
//             <Label>Destination</Label>
//             <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
//               <Input
//                 placeholder="e.g., Goa, India"
//                 defaultValue={destination}
//                 required
//               />
//             </Autocomplete>
//           </div>

//           <div className="grid gap-2">
//             <Label>Start Date</Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {startDate ? format(startDate, "LLL dd, y") : "Pick a start date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div className="grid gap-2">
//             <Label>End Date</Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {endDate ? format(endDate, "LLL dd, y") : "Pick an end date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={{ before: startDate || new Date(0) }} initialFocus />
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div className="grid gap-2">
//             <Label>Radius (meters)</Label>
//             <Input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
//           </div>

//           {error && <div className="text-red-600">{error}</div>}
//         </CardContent>
//         <CardFooter>
//           <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700">
//             <Search className="mr-2 h-4 w-4" /> {buttonText}
//           </Button>
//         </CardFooter>
//       </form>

//       <div className="flex mt-4 gap-4">
//         <div className="w-80 p-2 border overflow-y-auto bg-gray-50 max-h-[500px]">
//           {hotels.length === 0 && <div className="text-gray-500 text-sm">No hotels yet</div>}
//           {hotels.map((h, i) => (
//             <div key={i} onClick={() => handleHotelClick(h)} className={`p-2 mb-2 rounded-md cursor-pointer transition ${selectedHotel === h ? "bg-blue-100" : "hover:bg-gray-100"}`}>
//               <div className="font-semibold">{h.name}</div>
//               <div className="text-sm text-gray-600">{h.address}</div>
//               <div className="text-sm text-yellow-600">⭐ {h.rating || "N/A"} ({h.reviews || 0})</div>
//               {h.photo && <img src={h.photo} alt={h.name} className="mt-2 w-full rounded-md border" />}
//             </div>
//           ))}
//         </div>

//         <div className="flex-1">
//           <GoogleMap
//             mapContainerStyle={MAP_CONTAINER}
//             center={destLatLng || { lat: 20.5937, lng: 78.9629 }}
//             zoom={destLatLng ? 12 : 5}
//             onLoad={(map) => (mapRef.current = map)}
//           >
//             {destLatLng && (
//               <Marker position={destLatLng} label={{ text: `Radius: ${radius} m`, fontWeight: "bold", fontSize: "12px", color: "#1976d2" }} />
//             )}

//             {hotels.map((h, i) => (
//               <Marker key={i} position={h.location} onClick={() => setSelectedHotel(h)} title={h.name} />
//             ))}

//             {selectedHotel && (
//               <InfoWindow position={selectedHotel.location} onCloseClick={() => setSelectedHotel(null)}>
//                 <div className="max-w-xs">
//                   <strong className="block">{selectedHotel.name}</strong>
//                   <div className="text-sm text-gray-600">{selectedHotel.address}</div>
//                   <div className="text-sm text-yellow-600">⭐ {selectedHotel.rating || "N/A"} ({selectedHotel.reviews || 0})</div>
//                   {selectedHotel.photo && <img src={selectedHotel.photo} alt={selectedHotel.name} className="mt-2 w-full rounded-md" />}
//                   <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.address)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                     View in Maps
//                   </a>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         </div>
//       </div>
//     </Card>
//   );
// }



