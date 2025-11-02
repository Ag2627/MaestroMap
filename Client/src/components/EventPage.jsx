// // // src/pages/EventPage.jsx
// // import React, { useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { format } from "date-fns";
// // import axios from "axios";
// // import { ExternalLink, Ticket } from "lucide-react"; // Using icons for a better UI
// // import { FormPage } from "@/pages/FormPage";

// // export default function EventPage() {
// //   const [eventData, setEventData] = useState(null);
// //   const [tripDetails, setTripDetails] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const handleFormSubmit = async (data) => {
// //     setTripDetails(data);
// //     setEventData(null);
// //     setError(null);
// //     setIsLoading(true);

// //     try {
// //       // IMPORTANT: Replace this with your actual backend endpoint for events
// //       const API_ENDPOINT = "http://localhost:5000/api/trip/events"; 
      
// //       const formattedStartDate = format(data.startDate, "yyyy-MM-dd");
// //       const formattedEndDate = format(data.endDate, "yyyy-MM-dd");

// //       const response = await axios.post(API_ENDPOINT, {
// //         destination: data.destination,
// //         startDate: formattedStartDate,
// //         endDate: formattedEndDate,
// //       });

// //       if (response.data.success && response.data.tripPlan?.event?.status === "success") {
// //         setEventData(response.data.tripPlan.event.data.events);
// //       } else {
// //         const errorMessage = response.data.tripPlan?.event?.error_message || "Could not find any events.";
// //         // If the events array is empty, we can show a specific message
// //         if (response.data.tripPlan?.event?.data?.events?.length === 0) {
// //             setError("No events found for the selected destination and dates.");
// //         } else {
// //             setError(errorMessage);
// //         }
// //       }
// //     } catch (err) {
// //       setError("Failed to connect to the backend server. Is it running?");
// //       console.error(err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 to-amber-100">
// //       <div className="w-full max-w-4xl space-y-8">
// //         <FormPage
// //           title="Planner's Event Finder"
// //           description="Discover concerts, festivals, and local happenings to make your tour unforgettable."
// //           buttonText="Find Events"
// //           onSubmit={handleFormSubmit}
// //         />

// //         {/* --- ✨ ENHANCED LOADING STATE --- */}
// //         {isLoading && (
// //           <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
// //             <div className="text-5xl animate-pulse">🎟️</div>
// //             <p className="font-medium text-lg text-orange-700">
// //               Searching for the best events...
// //             </p>
// //           </div>
// //         )}

// //         {/* --- ✨ ENHANCED ERROR STATE --- */}
// //         {error && (
// //           <Card className="shadow-lg bg-red-100 border-red-400 animate-fade-in">
// //             <CardHeader className="flex flex-row items-center space-x-4">
// //               <div className="text-3xl">⚠️</div>
// //               <CardTitle className="text-xl text-red-800">
// //                 Information
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="text-red-700 font-medium ml-12 -mt-4">
// //               {error}
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* --- ✨ ENHANCED RESULTS DISPLAY --- */}
// //         {eventData && tripDetails && !isLoading && (
// //           <Card className="shadow-xl bg-white/60 backdrop-blur-md border border-white/50 animate-fade-in">
// //             <CardHeader>
// //               <CardTitle className="text-2xl font-bold text-slate-800">
// //                 Events in {tripDetails.destination}
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-4">
// //                 {eventData.map((event, index) => (
// //                   <Card
// //                     key={index}
// //                     className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 hover:bg-white transition-colors duration-200"
// //                   >
// //                     <div className="flex-grow">
// //                       <p className="font-bold text-lg text-slate-800">{event.name}</p>
// //                       <p className="text-sm text-slate-500">{event.venue}</p>
// //                        <p className="text-sm text-slate-500 mt-1">
// //                         {format(new Date(event.date), "EEE, LLL dd, yyyy")} at {event.time}
// //                       </p>
// //                     </div>
// //                     <div className="flex-shrink-0 w-full md:w-auto">
// //                        <Button asChild className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
// //                          <a href={event.url} target="_blank" rel="noopener noreferrer">
// //                            View Tickets
// //                            <ExternalLink className="ml-2 h-4 w-4" />
// //                          </a>
// //                        </Button>
// //                     </div>
// //                   </Card>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { format } from "date-fns";
// import axios from "axios";
// import { ExternalLink, Ticket } from "lucide-react"; // Using icons for a better UI
// import { FormPage } from "../pages/FormPage";

// export default function EventPage() {
//   const [eventData, setEventData] = useState(null);
//   const [tripDetails, setTripDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFormSubmit = async (data) => {
//     setTripDetails(data);
//     setEventData(null);
//     setError(null);
//     setIsLoading(true);

//     try {
//       // This is your main backend endpoint that calls the EventAgent
//       const API_ENDPOINT = "http://localhost:5000/api/trip/events"; 
      
//       const formattedStartDate = format(data.startDate, "yyyy-MM-dd");
//       const formattedEndDate = format(data.endDate, "yyyy-MM-dd");

//        const response = await axios.post(API_ENDPOINT, {
//         destination: tripDetails.destination,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//       });

//       const eventResponse = response.data.tripPlan?.event;

//       if (eventResponse?.status === "success" && eventResponse.data?.events?.length > 0) {
//         setEventData(eventResponse.data.events);
//       } else {
//         setError(eventResponse?.message || "No events found for the selected destination and dates.");
//       }
//     } catch (err) {
//       setError("Failed to connect to the backend server. Is it running?");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 to-amber-100">
//       <div className="w-full max-w-4xl space-y-8">
//         <FormPage
//           title="Planner's Event Finder"
//           description="Discover concerts, festivals, and local happenings to make your tour unforgettable."
//           buttonText="Find Events"
//           onSubmit={handleFormSubmit}
//         />

//         {isLoading && (
//           <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
//             <div className="text-5xl animate-pulse">🎟️</div>
//             <p className="font-medium text-lg text-orange-700">
//               Searching for the best events...
//             </p>
//           </div>
//         )}

//         {error && (
//           <Card className="shadow-lg bg-red-100 border-red-400 animate-fade-in">
//             <CardHeader className="flex flex-row items-center space-x-4">
//               <div className="text-3xl">⚠️</div>
//               <CardTitle className="text-xl text-red-800">
//                 Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="text-red-700 font-medium ml-12 -mt-4">
//               {error}
//             </CardContent>
//           </Card>
//         )}

//         {eventData && tripDetails && !isLoading && (
//           <Card className="shadow-xl bg-white/60 backdrop-blur-md border border-white/50 animate-fade-in">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-slate-800">
//                 Events in {tripDetails.destination}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {eventData.map((event, index) => (
//                   <Card
//                     key={index}
//                     className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 hover:bg-white transition-colors duration-200"
//                   >
//                     <div className="flex-grow">
//                       <p className="font-bold text-lg text-slate-800">{event.name}</p>
//                       <p className="text-sm text-slate-500">{event.venue}</p>
//                        <p className="text-sm text-slate-500 mt-1">
//                          {/* --- THIS LOGIC IS NOW SAFER --- */}
//                          {/* It safely handles the date and checks if time exists */}
//                          {format(new Date(event.date), "EEE, LLL dd, yyyy")} 
//                          {event.time && event.time !== "Not specified" ? ` at ${event.time}` : ''}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-2 flex-shrink-0 w-full md:w-auto">
//                         <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
//                             {event.source}
//                         </span>
//                        <Button asChild className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
//                          <a href={event.url} target="_blank" rel="noopener noreferrer">
//                            View Event
//                            <ExternalLink className="ml-2 h-4 w-4" />
//                          </a>
//                        </Button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/EventPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import axios from "axios";
import { ExternalLink, MapPin, Calendar, Search } from "lucide-react";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
    <div className="animate-pulse text-5xl">🎟️</div>
    <p className="font-medium text-lg text-orange-700">
      Searching for the best events...
    </p>
  </div>
);

export default function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for Google Places Autocomplete
  const destinationRef = useRef(null);
  const autocompleteRef = useRef(null);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    if (destinationRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        destinationRef.current,
        { types: ["(cities)"] }
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.address_components) {
          const city = place.address_components[0].long_name;
          setTripDetails((prev) => ({ ...prev, destination: city }));
          if (destinationRef.current) {
            destinationRef.current.value = city;
          }
        }
      });
    }
  };

  const handleFormSubmit = async () => {
    if (!tripDetails.destination || !tripDetails.startDate || !tripDetails.endDate) {
      setError("Please fill in all fields to find events.");
      return;
    }
    setEventData(null);
    setError(null);
    setIsLoading(true);
    try {
      const API_ENDPOINT = "http://localhost:5000/api/trip/events";
      const formattedStartDate = format(new Date(tripDetails.startDate), "yyyy-MM-dd");
      const formattedEndDate = format(new Date(tripDetails.endDate), "yyyy-MM-dd");
      const response = await axios.post(API_ENDPOINT, {
        destination: tripDetails.destination,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      const eventResponse = response.data.tripPlan?.event;
      if (eventResponse?.status === "success" && eventResponse.data?.events?.length > 0) {
        setEventData(eventResponse.data.events);
      } else {
        setError(eventResponse?.message || "No events found for the selected destination and dates.");
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Is it running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Event Finder
          </h1>
          <p className="text-gray-700 flex items-center justify-center gap-2">
            🎟️ Discover concerts, festivals, and local happenings for your trip
          </p>
        </div>

        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-orange-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <MapPin size={16} /> Destination City
                </label>
                <input
                  ref={destinationRef}
                  type="text"
                  placeholder="e.g., New York"
                  className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                  defaultValue={tripDetails.destination}
                  onChange={(e) =>
                    setTripDetails((prev) => ({ ...prev, destination: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Start Date
                  </label>
                  <input
                    type="date"
                    // --- CHANGE 1: CONTROLLED INPUT & LOGIC TO RESET END DATE ---
                    value={tripDetails.startDate || ""}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      if (tripDetails.endDate && newStartDate > tripDetails.endDate) {
                        setTripDetails((prev) => ({
                          ...prev,
                          startDate: newStartDate,
                          endDate: null,
                        }));
                      } else {
                        setTripDetails((prev) => ({ ...prev, startDate: newStartDate }));
                      }
                    }}
                    className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> End Date
                  </label>
                  <input
                    type="date"
                    // --- CHANGE 2: DYNAMICALLY SET MIN, DISABLED, AND VALUE ---
                    value={tripDetails.endDate || ""}
                    min={tripDetails.startDate}
                    disabled={!tripDetails.startDate}
                    onChange={(e) =>
                      setTripDetails((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start">
                 <Button
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    className="w-full px-8 py-7 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 flex items-center gap-2"
                  >
                   {isLoading ? "Searching..." : <><Search size={18} /> Find Events</>}
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && <LoadingSpinner />}

        {error && (
          <Card className="shadow-lg bg-red-100 border-red-400 animate-fade-in">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="text-3xl">⚠️</div>
              <CardTitle className="text-xl text-red-800">Information</CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 font-medium ml-12 -mt-4">
              {error}
            </CardContent>
          </Card>
        )}

        {eventData && !isLoading && (
          <Card className="shadow-xl bg-white/60 backdrop-blur-md border border-white/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Events in {tripDetails.destination}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventData.map((event, index) => (
                  <Card
                    key={index}
                    className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 hover:bg-white transition-colors duration-200"
                  >
                    <div className="flex-grow">
                      <p className="font-bold text-lg text-slate-800">{event.name}</p>
                      <p className="text-sm text-slate-500">{event.venue}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {format(new Date(event.date), "EEE, LLL dd, yyyy")}
                        {event.time && event.time !== "Not specified" ? ` at ${event.time}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 w-full md:w-auto">
                       <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {event.source}
                       </span>
                       <Button asChild className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
                         <a href={event.url} target="_blank" rel="noopener noreferrer">
                           View Event
                           <ExternalLink className="ml-2 h-4 w-4" />
                         </a>
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}