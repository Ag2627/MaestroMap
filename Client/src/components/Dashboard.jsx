import { useState, useEffect } from 'react';
// import axios from 'axios'; // 1. REMOVED: No longer needed for API calls.
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// 2. REMOVED: Backend URL constants are no longer necessary.
// const BACKEND_URL = "http://localhost:5000";
// const API = `${BACKEND_URL}/api`;

// 3. ADDED: Mock data to simulate fetching trips from a backend.
const MOCK_TRIPS_DATA = [
  {
    id: 'trip_1',
    status: 'completed',
    request: {
      destination: 'Paris, France',
      start_date: '2025-08-15',
      end_date: '2025-08-22',
      travelers_count: 2,
      budget_range: 'high',
      interests: ['culture', 'food', 'history'],
    },
  },
  {
    id: 'trip_2',
    status: 'processing',
    request: {
      destination: 'Kyoto, Japan',
      start_date: '2025-10-05',
      end_date: '2025-10-12',
      travelers_count: 1,
      budget_range: 'medium',
      interests: ['nature', 'food', 'culture'],
    },
  },
];


const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planningTrip, setPlanningTrip] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  
  // Form state remains the same
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState('medium');
  const [travelers, setTravelers] = useState(1);
  const [interests, setInterests] = useState([]);

  const availableInterests = ['culture', 'adventure', 'food', 'nightlife', 'nature', 'history', 'shopping', 'sports'];

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
  console.log("Logged in user:", user);
}, [user]);


  // 4. UPDATED: The fetchTrips function now simulates an API call.
  const fetchTrips = () => {
    console.log("Fetching mock trips...");
    setLoading(true);
    // Use setTimeout to mimic network delay
    setTimeout(() => {
      setTrips(MOCK_TRIPS_DATA);
      setLoading(false);
      toast("Dashboard Loaded", {
        description: "Your adventures are ready to view.",
      });
    }, 1500); // 1.5-second delay
  };

  // 5. UPDATED: The handlePlanTrip function now simulates creating a trip.
  const handlePlanTrip = () => {
    // Validation remains the same
    if (!destination || !startDate || !endDate) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (startDate >= endDate) {
      toast.error("Invalid Dates", {
        description: "End date must be after start date.",
      });
      return;
    }

    setPlanningTrip(true);
    
    // Simulate API call delay for planning
    setTimeout(() => {
      const newTripId = `trip_${Date.now()}`;
      const newTrip = {
        id: newTripId,
        status: 'completed', // You can set this to 'processing' to see that state
        request: {
          destination: destination.trim(),
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          budget_range: budget,
          travelers_count: travelers,
          interests: interests
        }
      };

      // Add the new trip to the beginning of the trips array
      setTrips(prevTrips => [newTrip, ...prevTrips]);
      
      toast.success("Trip Planned! 🎪", {
        description: `Your ${destination} adventure is ready! The agents have worked their magic.`,
      });

      // Navigate to a new page (you'll need to create this route/component)
      navigate(`/trip/${newTripId}`);
      
      setPlanningTrip(false);
      setShowPlanForm(false); // Hide the form after submission
      // Optional: Reset form fields
      // setDestination('');
      // setStartDate(null);
      // setEndDate(null);
    }, 2000); // 2-second delay
  };

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                  data-testid="user-avatar"
                />
                <span className="text-gray-700 font-medium" data-testid="user-name">{user.fullname}</span>
              </div>
              <Button 
                onClick={onLogout} 
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                data-testid="logout-btn"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 🎪</h2>
          <p className="text-lg text-gray-600">Ready to orchestrate another grand tour? Your expert agents are standing by.</p>
        </div>

        {/* Plan New Trip Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full text-lg"
            data-testid="plan-new-trip-btn"
          >
            <i className="fas fa-plus mr-2"></i>
            Plan New Adventure
          </Button>
        </div>

        {/* Trip Planning Form */}
        {showPlanForm && (
          <Card className="mb-8 bg-white/90 backdrop-blur-sm" data-testid="trip-planning-form">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <i className="fas fa-map-marked-alt text-orange-500 mr-3"></i>
                Plan Your Grand Tour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Destination */}
              <div>
                <Label htmlFor="destination" className="text-base font-medium text-gray-700">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Where shall we take the circus?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-2"
                  data-testid="destination-input"
                />
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium text-gray-700">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-start text-left font-normal"
                        data-testid="start-date-picker"
                      >
                        <i className="fas fa-calendar mr-2"></i>
                        {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-base font-medium text-gray-700">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-start text-left font-normal"
                        data-testid="end-date-picker"
                      >
                        <i className="fas fa-calendar mr-2"></i>
                        {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < new Date() || (startDate && date <= startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Budget and Travelers */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium text-gray-700">Budget Range</Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger className="mt-2" data-testid="budget-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Budget ($50-100/day)</SelectItem>
                      <SelectItem value="medium">Medium Budget ($100-200/day)</SelectItem>
                      <SelectItem value="high">High Budget ($200+/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-medium text-gray-700">Number of Travelers</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    className="mt-2"
                    data-testid="travelers-input"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">Interests</Label>
                <div className="flex flex-wrap gap-2" data-testid="interests-section">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-colors ${
                        interests.includes(interest) 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'hover:bg-orange-50 hover:text-orange-600'
                      }`}
                      onClick={() => toggleInterest(interest)}
                      data-testid={`interest-${interest}`}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  onClick={handlePlanTrip}
                  disabled={planningTrip}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg"
                  data-testid="orchestrate-trip-btn"
                >
                  {planningTrip ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Agents are collaborating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Orchestrate the Perfect Tour
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Trips */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Grand Tours</h3>
          {trips.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm" data-testid="no-trips-message">
              <CardContent className="text-center py-12">
                <i className="fas fa-compass text-6xl text-gray-300 mb-4"></i>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No adventures yet!</h4>
                <p className="text-gray-500">Create your first trip plan and let our agents work their magic.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="trips-grid">
              {trips.map((trip) => (
                <Card 
                  key={trip.id} 
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  data-testid={`trip-card-${trip.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        <i className="fas fa-map-marker-alt text-orange-500 mr-2"></i>
                        {trip.request.destination}
                      </CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(trip.status)}`} data-testid={`trip-status-${trip.id}`}></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <i className="fas fa-calendar mr-2"></i>
                        {trip.request.start_date} to {trip.request.end_date}
                      </p>
                      <p>
                        <i className="fas fa-users mr-2"></i>
                        {trip.request.travelers_count} traveler{trip.request.travelers_count > 1 ? 's' : ''}
                      </p>
                      <p>
                        <i className="fas fa-dollar-sign mr-2"></i>
                        {trip.request.budget_range} budget
                      </p>
                      {trip.request.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {trip.request.interests.slice(0, 3).map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {trip.request.interests.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{trip.request.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Badge 
                        variant={trip.status === 'completed' ? 'default' : trip.status === 'processing' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {trip.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;