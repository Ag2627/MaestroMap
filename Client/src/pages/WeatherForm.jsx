import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FormPage({
  title,
  description,
  buttonText,
  isLoading,
  tripDetails,
  onDetailsChange,
  onSubmit,
}) {
  const destinationRef = useRef(null);
  const autocompleteRef = useRef(null);
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize Google Places Autocomplete
  useEffect(() => {
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
            // Notify the parent component that the destination has changed
            onDetailsChange("destination", city);
          }
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    } else {
      initAutocomplete();
    }
  }, [GOOGLE_API_KEY, onDetailsChange]);

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-gray-700">{description}</p>
      </div>

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-orange-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Destination Input */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">📍 Destination City</label>
              <input
                ref={destinationRef}
                type="text"
                placeholder="Enter destination city"
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                value={tripDetails.destination}
                onChange={(e) => onDetailsChange("destination", e.target.value)}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">📅 Start Date</label>
              <input
                type="date"
                value={tripDetails.startDate || ""}
                onChange={(e) => onDetailsChange("startDate", e.target.value)}
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">📅 End Date</label>
              <input
                type="date"
                value={tripDetails.endDate || ""}
                onChange={(e) => onDetailsChange("endDate", e.target.value)}
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700"
            > 
              {isLoading ? "⏳ Searching..." : buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}