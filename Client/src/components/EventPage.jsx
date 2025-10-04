// src/pages/EventPage.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import axios from "axios";
import { ExternalLink, Ticket } from "lucide-react"; // Using icons for a better UI
import { FormPage } from "../pages/FormPage";

export default function EventPage() {
  const [eventData, setEventData] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    setTripDetails(data);
    setEventData(null);
    setError(null);
    setIsLoading(true);

    try {
      // IMPORTANT: Replace this with your actual backend endpoint for events
      const API_ENDPOINT = "http://localhost:5000/api/trip/events"; 
      
      const formattedStartDate = format(data.startDate, "yyyy-MM-dd");
      const formattedEndDate = format(data.endDate, "yyyy-MM-dd");

       const response = await axios.post(API_ENDPOINT, {
        destination: tripDetails.destination,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      if (response.data.success && response.data.tripPlan?.event?.status === "success") {
        setEventData(response.data.tripPlan.event.data.events);
      } else {
        const errorMessage = response.data.tripPlan?.event?.error_message || "Could not find any events.";
        // If the events array is empty, we can show a specific message
        if (response.data.tripPlan?.event?.data?.events?.length === 0) {
            setError("No events found for the selected destination and dates.");
        } else {
            setError(errorMessage);
        }
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
          title="Planner's Event Finder"
          description="Discover concerts, festivals, and local happenings to make your tour unforgettable."
          buttonText="Find Events"
          onSubmit={handleFormSubmit}
        />

        {/* --- ✨ ENHANCED LOADING STATE --- */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="text-5xl animate-pulse">🎟️</div>
            <p className="font-medium text-lg text-orange-700">
              Searching for the best events...
            </p>
          </div>
        )}

        {/* --- ✨ ENHANCED ERROR STATE --- */}
        {error && (
          <Card className="shadow-lg bg-red-100 border-red-400 animate-fade-in">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="text-3xl">⚠️</div>
              <CardTitle className="text-xl text-red-800">
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 font-medium ml-12 -mt-4">
              {error}
            </CardContent>
          </Card>
        )}

        {/* --- ✨ ENHANCED RESULTS DISPLAY --- */}
        {eventData && tripDetails && !isLoading && (
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
                        {format(new Date(event.date), "EEE, LLL dd, yyyy")} at {event.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto">
                       <Button asChild className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
                         <a href={event.url} target="_blank" rel="noopener noreferrer">
                           View Tickets
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