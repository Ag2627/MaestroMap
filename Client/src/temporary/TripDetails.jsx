// src/pages/TripDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ItineraryDisplay from './ItineraryDisplay'; // Import the reusable component
import { FaArrowLeft, FaTachometerAlt } from 'react-icons/fa';

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
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-orange-800 font-medium">Loading your trip details...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 font-bold text-xl">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- UPDATED HEADER SECTION --- */}
        <div className="mb-8 flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-orange-200">
            <div>
                <Link to="/my-trips" className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-2 transition-colors">
                    <FaArrowLeft />
                    My Trips
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
                    {trip?.destinationName || 'Trip Details'}
                </h1>
            </div>
            <Link 
                to="/dashboard" 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
                <FaTachometerAlt />
                Back to Dashboard
            </Link>
        </div>
        
        {trip ? (
          <ItineraryDisplay
            itinerary={trip.itineraryData}
            destinationName={trip.destinationName}
          />
        ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-md">
                <p className="text-gray-600">Trip details could not be loaded.</p>
            </div>
        )}
      </div>
    </div>
  );
}