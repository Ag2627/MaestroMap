// // src/pages/WeatherPage.jsx
// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { format } from "date-fns";
// import axios from "axios";
// import { FormPage } from "@/pages/FormPage";

// // Helper function to get an emoji icon from weather description
// const getWeatherIcon = (description) => {
//   const desc = description.toLowerCase();
//   if (desc.includes("rain")) return "🌧️";
//   if (desc.includes("cloud")) return "☁️";
//   if (desc.includes("snow")) return "❄️";
//   if (desc.includes("clear")) return "☀️";
//   if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
//   return "🌍"; // Default icon
// };

// export function WeatherPage() {
//   const [weatherData, setWeatherData] = useState(null);
//   const [tripDetails, setTripDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFormSubmit = async (data) => {
//     setTripDetails(data);
//     setWeatherData(null);
//     setError(null);
//     setIsLoading(true);

//     try {
//       const API_ENDPOINT = "http://localhost:5000/api/trip/weather"; // Replace with your backend URL

//       const formattedStartDate = format(data.startDate, "yyyy-MM-dd");
//       const formattedEndDate = format(data.endDate, "yyyy-MM-dd");

//       const response = await axios.post(API_ENDPOINT, {
//         destination: data.destination,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//       });

//       // --- ⬇️ KEY CHANGES ARE HERE ⬇️ ---

//       // 1. SUCCESS CHECK UPDATED for the new response structure
//       if (response.data.success && response.data.tripPlan?.weather?.status === "success") {
        
//         // 2. PATH TO FORECAST UPDATED to go through `tripPlan` and `weather`
//         const transformedForecast = response.data.tripPlan.weather.data.forecast.map((day) => ({
//           date: day.date,
//           temp: `${Math.round(day.tempMin)}°C / ${Math.round(day.tempMax)}°C`,
//           condition: day.description,
//           icon: getWeatherIcon(day.description),
//         }));
//         setWeatherData(transformedForecast);
//       } else {
//         // 3. ERROR HANDLING UPDATED for the new structure
//         const errorMessage = response.data.tripPlan?.weather?.error_message || "An unknown error occurred.";
//         setError(errorMessage);
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
//           title="Sky Gazer's Weather Forecast"
//           description="Provide a destination and dates to get a detailed weather report from our expert Sky Gazer."
//           buttonText="Get Forecast"
//           onSubmit={handleFormSubmit}
//         />

//         {isLoading && (
//           <div className="text-center font-medium text-orange-600">
//             🔭 Consulting the Sky Gazer...
//           </div>
//         )}

//         {error && (
//           <Card className="shadow-lg bg-red-100 border-red-400">
//             <CardHeader>
//               <CardTitle className="text-xl text-red-800">Error</CardTitle>
//             </CardHeader>
//             <CardContent className="text-red-700">{error}</CardContent>
//           </Card>
//         )}

//         {weatherData && tripDetails && !isLoading && (
//           <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="text-xl">
//                 Forecast for {tripDetails.destination}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {weatherData.map((day, index) => (
//                   <div
//                     key={index}
//                     className="p-4 border rounded-lg bg-white text-center"
//                   >
//                     <p className="font-semibold">
//                       {day.date.includes("Day")
//                         ? day.date
//                         : format(new Date(day.date), "LLL dd")}
//                     </p>
//                     <p className="text-4xl my-2">{day.icon}</p>
//                     <p className="text-lg font-bold">{day.temp}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {day.condition}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/WeatherPage.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import axios from "axios";
import { FormPage } from "@/pages/FormPage";

// Helper function to get an emoji icon from weather description
const getWeatherIcon = (description) => {
  const desc = description.toLowerCase();
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌍"; // Default icon
};

export function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    setTripDetails(data);
    setWeatherData(null);
    setError(null);
    setIsLoading(true);

    try {
      const API_ENDPOINT = "http://localhost:5000/api/trip/weather"; // Replace with your backend URL

      const formattedStartDate = format(data.startDate, "yyyy-MM-dd");
      const formattedEndDate = format(data.endDate, "yyyy-MM-dd");

      const response = await axios.post(API_ENDPOINT, {
        destination: data.destination,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      
      if (response.data.success && response.data.tripPlan?.weather?.status === "success") {
        const transformedForecast = response.data.tripPlan.weather.data.forecast.map((day) => ({
          date: day.date,
          temp: `${Math.round(day.tempMin)}°C / ${Math.round(day.tempMax)}°C`,
          condition: day.description,
          icon: getWeatherIcon(day.description),
        }));
        setWeatherData(transformedForecast);
      } else {
        const errorMessage = response.data.tripPlan?.weather?.error_message || "An unknown error occurred.";
        setError(errorMessage);
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Is it running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full max-w-4xl space-y-8">
        <FormPage
          title="Sky Gazer's Weather Forecast"
          description="Provide a destination and dates to get a detailed weather report from our expert Sky Gazer."
          buttonText="Get Forecast"
          onSubmit={handleFormSubmit}
        />

        {/* --- ✨ ENHANCED LOADING STATE --- */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="text-5xl animate-spin">☀️</div>
            <p className="font-medium text-lg text-orange-700">
              Consulting the Sky Gazer...
            </p>
          </div>
        )}

        {/* --- ✨ ENHANCED ERROR STATE --- */}
        {error && (
          <Card className="shadow-lg bg-red-100 border-red-400 animate-fade-in">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="text-3xl">⚠️</div>
              <CardTitle className="text-xl text-red-800">
                An Error Occurred
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 font-medium ml-12 -mt-4">
              {error}
            </CardContent>
          </Card>
        )}

        {/* --- ✨ ENHANCED RESULTS DISPLAY --- */}
        {weatherData && tripDetails && !isLoading && (
          <Card className="shadow-xl bg-white/60 backdrop-blur-md border border-white/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Weather Forecast for {tripDetails.destination}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weatherData.map((day, index) => (
                  <Card
                    key={index}
                    className="text-center p-4 bg-gradient-to-br from-white/90 to-amber-50/70 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <CardHeader className="p-0 mb-2">
                      <p className="font-bold text-slate-700">
                        {day.date.includes("Day")
                          ? day.date
                          : format(new Date(day.date), "EEE, LLL dd")}
                      </p>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col items-center gap-2">
                      <p className="text-5xl my-2">{day.icon}</p>
                      <p className="text-2xl font-bold text-slate-900">{day.temp}</p>
                      <p className="text-sm text-slate-500 capitalize">
                        {day.condition}
                      </p>
                    </CardContent>
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