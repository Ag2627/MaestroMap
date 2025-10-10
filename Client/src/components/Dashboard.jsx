import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { FaTrash, FaPlus, FaCalculator, FaBalanceScale } from 'react-icons/fa';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button'; 

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
  </div>
);

export default function Dashboard({ onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ origin: '', destination: '', startDate: '', endDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);


  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/my-trips`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch your saved trips.");
        const data = await res.json();
        setTrips(data.itineraries || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [user]);

  const computeAverages = (routes) => {
    if (!routes || !routes.length) return { avgDistance: "N/A", avgDuration: "N/A" };
    let totalDistance = 0, totalDuration = 0;
    routes.forEach(r => {
      const dist = parseFloat(r.distance.replace(" km", ""));
      const dur = parseFloat(r.duration.replace(" min", ""));
      if (!isNaN(dist)) totalDistance += dist;
      if (!isNaN(dur)) totalDuration += dur;
    });
    return {
      avgDistance: (totalDistance / routes.length).toFixed(1),
      avgDuration: ((totalDuration / 60) / routes.length).toFixed(1)
    };
  };

  const performDeletion = async (tripId) => {
    setDeletingId(tripId);
    const deletePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/${tripId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    await toast.promise(deletePromise, {
      loading: 'Deleting trip...',
      success: () => {
        setTrips((cur) => cur.filter((t) => t._id !== tripId));
        return 'Trip deleted successfully!';
      },
      error: 'Failed to delete trip.',
    });

    setDeletingId(null);
  };

  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    toast((t) => (
      <div className="flex flex-col items-center gap-3 p-2">
        <p className="font-semibold text-center">Are you sure you want to delete this trip?</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDeletion(tripId);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your dashboard and saved trips.</p>
          <Link to="/signin">
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
              <p className="text-sm text-gray-600">Grand Orchestrator Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff`}
                alt={user.fullname}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 font-medium">{user.fullname}</span>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}! 🗺️</h2>
          <p className="text-lg text-gray-600">Ready to plan your next adventure?</p>
        </div>

        {/* --- Action Buttons (UPDATED SECTION) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Button 1: Generate Itinerary */}
          <Link to="/generate" className="w-full">
            <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
              <FaPlus /> Generate Itinerary
            </button>
          </Link>
          
          {/* Button 2: Compare Places (NEW) */}
          <Link to="/compare" className="w-full">
            <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
              <FaBalanceScale /> Compare Places
            </button>
          </Link>

          {/* Button 3: Estimate Cost */}
          <Link to="/cost" className="w-full sm:col-span-2 lg:col-span-1">
            <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
              <FaCalculator /> Estimate Route Cost
            </button>
          </Link>
        </div>

        {/* New Adventure Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-xl relative">
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg">&times;</button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan New Adventure</h3>
              <form className="space-y-4" onSubmit={handleSubmitAdventure}>
                <input type="text" name="origin" placeholder="Origin City" value={formData.origin} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                <input type="text" name="destination" placeholder="Destination City" value={formData.destination} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                <div className="flex gap-4">
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all duration-300">
                  {isSubmitting ? "Planning..." : "Plan Adventure"}
                </button>
              </form>

              {/* Adventure Summary */}
              {summary && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-gray-800">
                  <h4 className="font-semibold mb-2">Adventure Summary:</h4>
                  <p>Estimated Cost: ₹{summary.estimatedCost}</p>
                  <p>Weather: {summary.agents.weather?.description || "not available"}</p>
                  <p>
                    Events: {
                      summary.agents.events && summary.agents.events.length
                        ? summary.agents.events.length <= 3
                          ? summary.agents.events.map(ev => ev.name).join(", ")
                          : summary.agents.events.slice(0, 3).map(ev => ev.name).join(", ")
                        : "none found"
                    }
                  </p>
                  {summary.agents.map && summary.agents.map.length > 0 && (() => {
                    const { avgDistance, avgDuration } = computeAverages(summary.agents.map);
                    return (
                      <>
                        <p>Routes: {summary.agents.map.length}</p>
                        <p>Average Distance: {avgDistance} km</p>
                        <p>Average Duration: {avgDuration} hrs</p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}


        {/* --- NEW Prettier Trips Section --- */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Saved Trips</h2>
                <p className="text-gray-600">Explore your adventure collection</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : trips.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Trips Found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                You haven't saved any itineraries yet. Start planning your dream adventure today!
              </p>
              <button
                onClick={() => navigate('/generate')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaPlus className="w-5 h-5" />
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  onClick={() => navigate(`/my-trips/${trip._id}`)}
                  className="group bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 rounded-2xl shadow-md cursor-pointer hover:shadow-2xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                          <MapPin className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {trip.destinationName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 flex justify-between items-center border-t-2 border-orange-100">
                    <span className="text-sm font-semibold text-orange-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      View Details
                    </span>
                    <button
                      onClick={(e) => handleDeleteTrip(e, trip._id)}
                      disabled={deletingId === trip._id}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110"
                      title="Delete Trip"
                    >
                      {deletingId === trip._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                      ) : (
                        <FaTrash className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
