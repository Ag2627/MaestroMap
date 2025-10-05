// src/pages/TripDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ItineraryDisplay from './ItineraryDisplay'; // Import the reusable component

export default function TripDetails() {
  const { tripId } = useParams(); // Gets the ':id' from the URL
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/${tripId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Could not fetch trip details.');
        }
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, user]);

  if (isLoading) {
    return <div className="text-center p-10">Loading your trip...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/my-trips" className="text-blue-600 hover:underline">
            &larr; Back to all trips
          </Link>
        </div>
        {trip && (
          <ItineraryDisplay
            itinerary={trip.itineraryData}
            destinationName={trip.destinationName}
          />
        )}
      </div>
    </div>
  );
}