import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// --- Spinner Component ---
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
         5.291A7.962 7.962 0 014 12H0c0 
         3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- TripCard Component ---
const TripCard = ({ trip, onDelete, isDeleting }) => {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(trip._id);
  };

  return (
    <Link to={`/my-trips/${trip._id}`} className="block">
      <div className="group bg-white/90 backdrop-blur-sm border border-orange-200 shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">
              {trip.destinationName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Saved on:{" "}
              <span className="font-medium text-gray-600">
                {new Date(trip.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center justify-center w-24 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-sm hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? <Spinner /> : "Delete"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/itinerary/my-trips`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch your saved trips.");
        const data = await res.json();
        setTrips(data.itineraries);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [user]);

  const handleDeleteTrip = (tripId) => {
    toast((t) => (
      <span className="flex flex-col items-center gap-3">
        <p className="font-semibold">Are you sure you want to delete this trip?</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDeletion(tripId);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 3000 });
  };

  const performDeletion = async (tripId) => {
    setDeletingId(tripId);
    const deletePromise = fetch(
      `${import.meta.env.VITE_API_BASE_URL}/itinerary/${tripId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    await toast.promise(deletePromise, {
      loading: "Deleting trip...",
      success: () => {
        setTrips((t) => t.filter((trip) => trip._id !== tripId));
        return "Trip deleted successfully!";
      },
      error: "Failed to delete trip.",
    });

    setDeletingId(null);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-orange-700">
        Loading your trips...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-md border border-orange-200">
          <h1 className="text-2xl font-bold mb-4 text-orange-700">
            Access Denied
          </h1>
          <p className="text-gray-600">Please log in to see your saved trips.</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-6">
          My Trips
        </h1>

        {trips.length > 0 ? (
          <div className="space-y-6">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={handleDeleteTrip}
                isDeleting={deletingId === trip._id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-2 text-orange-700">
              No Trips Found
            </h2>
            <p className="text-gray-600">
              You haven't saved any itineraries yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
