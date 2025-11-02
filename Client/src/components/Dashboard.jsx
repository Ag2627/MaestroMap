// // import { useState, useEffect } from 'react';
// // // import axios from 'axios'; // 1. REMOVED: No longer needed for API calls.
// // import { Button } from './ui/button';
// // import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// // import { Input } from './ui/input';
// // import { Label } from './ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// // import { Badge } from './ui/badge';
// // import { Calendar } from './ui/calendar';
// // import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
// // import { toast } from 'sonner';
// // import { format } from 'date-fns';
// // import { Link,useNavigate } from 'react-router-dom';


// // const Dashboard = ({ user, onLogout }) => {
// //   const navigate = useNavigate();
// //   const [trips, setTrips] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [planningTrip, setPlanningTrip] = useState(false);
// //   const [showPlanForm, setShowPlanForm] = useState(false);
  
// //   // Form state remains the same
// //   const [destination, setDestination] = useState('');
// //   const [startDate, setStartDate] = useState(null);
// //   const [endDate, setEndDate] = useState(null);
// //   const [budget, setBudget] = useState('medium');
// //   const [travelers, setTravelers] = useState(1);
// //   const [interests, setInterests] = useState([]);

// //   const availableInterests = ['culture', 'adventure', 'food', 'nightlife', 'nature', 'history', 'shopping', 'sports'];

// //   useEffect(() => {
// //     fetchTrips();
// //   }, []);

// //   useEffect(() => {
// //   console.log("Logged in user:", user);
// // }, [user]);


// //

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
// //           <p className="text-orange-800 font-medium">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
// //       {/* Header */}
//       // <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
//       //   <div className="max-w-7xl mx-auto px-6 py-4">
//       //     <div className="flex items-center justify-between">
//       //       <div className="flex items-center space-x-3">
//       //         <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
//       //           <i className="fas fa-magic"></i>
//       //         </div>
//       //         <div>
//       //           <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
//       //           <p className="text-sm text-gray-600">Grand Orchestrator Dashboard</p>
//       //         </div>
//       //       </div>
//       //       <div className="flex items-center space-x-4">
//       //         <div className="flex items-center space-x-3">
//       //           <img 
//       //             src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff`} 
//       //             alt={user.fullname} 
//       //             className="w-8 h-8 rounded-full"
//       //             data-testid="user-avatar"
//       //           />
//       //           <span className="text-gray-700 font-medium" data-testid="user-name">{user.fullname}</span>
//       //         </div>
//       //         <Button 
//       //           onClick={onLogout} 
//       //           variant="outline"
//       //           className="border-orange-200 text-orange-700 hover:bg-orange-50"
//       //           data-testid="logout-btn"
//       //         >
//       //           <i className="fas fa-sign-out-alt mr-2"></i>
//       //           Logout
//       //         </Button>
//       //       </div>
//       //     </div>
//       //   </div>
//       // </header>

// //       <div className="max-w-7xl mx-auto px-6 py-8">
// //         {/* Welcome Section */}
// //         <div className="mb-8">
// //           <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 🎪</h2>
// //           <p className="text-lg text-gray-600">Ready to orchestrate another grand tour? Your expert agents are standing by.</p>
// //         </div>

// //         {/* Plan New Trip Button */}
// //         <div className="mb-8">
// //           <Button 
// //             onClick={() => setShowPlanForm(!showPlanForm)}
// //             className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full text-lg"
// //             data-testid="plan-new-trip-btn"
// //           >
// //             <i className="fas fa-plus mr-2"></i>
// //             Plan New Adventure
// //           </Button>
// //         </div>


        
// //         <div className="mb-8">
// //           <Link to="/generate">
// //             <Button
// //               className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full text-lg"
// //               data-testid="generate-trip-btn"
// //             >
// //               <i className="fas fa-magic mr-2"></i>
// //               Plan new Trip
// //             </Button>
// //           </Link>
// //         </div>

// //         {/* Trip Planning Form */}
// //         {showPlanForm && (
// //           <Card className="mb-8 bg-white/90 backdrop-blur-sm" data-testid="trip-planning-form">
// //             <CardHeader>
// //               <CardTitle className="text-2xl text-gray-900 flex items-center">
// //                 <i className="fas fa-map-marked-alt text-orange-500 mr-3"></i>
// //                 Plan Your Grand Tour
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-6">
// //               {/* Destination */}
// //               <div>
// //                 <Label htmlFor="destination" className="text-base font-medium text-gray-700">Destination</Label>
// //                 <Input
// //                   id="destination"
// //                   placeholder="Where shall we take the circus?"
// //                   value={destination}
// //                   onChange={(e) => setDestination(e.target.value)}
// //                   className="mt-2"
// //                   data-testid="destination-input"
// //                 />
// //               </div>
              

// //               {/* Dates */}
// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <div>
// //                   <Label className="text-base font-medium text-gray-700">Start Date</Label>
// //                   <Popover>
// //                     <PopoverTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         className="w-full mt-2 justify-start text-left font-normal"
// //                         data-testid="start-date-picker"
// //                       >
// //                         <i className="fas fa-calendar mr-2"></i>
// //                         {startDate ? format(startDate, 'PPP') : 'Pick start date'}
// //                       </Button>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-auto p-0" align="start">
// //                       <Calendar
// //                         mode="single"
// //                         selected={startDate}
// //                         onSelect={setStartDate}
// //                         disabled={(date) => date < new Date()}
// //                         initialFocus
// //                       />
// //                     </PopoverContent>
// //                   </Popover>
// //                 </div>
// //                 <div>
// //                   <Label className="text-base font-medium text-gray-700">End Date</Label>
// //                   <Popover>
// //                     <PopoverTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         className="w-full mt-2 justify-start text-left font-normal"
// //                         data-testid="end-date-picker"
// //                       >
// //                         <i className="fas fa-calendar mr-2"></i>
// //                         {endDate ? format(endDate, 'PPP') : 'Pick end date'}
// //                       </Button>
// //                     </PopoverTrigger>
// //                     <PopoverContent className="w-auto p-0" align="start">
// //                       <Calendar
// //                         mode="single"
// //                         selected={endDate}
// //                         onSelect={setEndDate}
// //                         disabled={(date) => date < new Date() || (startDate && date <= startDate)}
// //                         initialFocus
// //                       />
// //                     </PopoverContent>
// //                   </Popover>
// //                 </div>
// //               </div>

// //               {/* Budget and Travelers */}
// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <div>
// //                   <Label className="text-base font-medium text-gray-700">Budget Range</Label>
// //                   <Select value={budget} onValueChange={setBudget}>
// //                     <SelectTrigger className="mt-2" data-testid="budget-select">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="low">Low Budget ($50-100/day)</SelectItem>
// //                       <SelectItem value="medium">Medium Budget ($100-200/day)</SelectItem>
// //                       <SelectItem value="high">High Budget ($200+/day)</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div>
// //                   <Label className="text-base font-medium text-gray-700">Number of Travelers</Label>
// //                   <Input
// //                     type="number"
// //                     min="1"
// //                     max="20"
// //                     value={travelers}
// //                     onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
// //                     className="mt-2"
// //                     data-testid="travelers-input"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Interests */}
// //               <div>
// //                 <Label className="text-base font-medium text-gray-700 mb-3 block">Interests</Label>
// //                 <div className="flex flex-wrap gap-2" data-testid="interests-section">
// //                   {availableInterests.map((interest) => (
// //                     <Badge
// //                       key={interest}
// //                       variant={interests.includes(interest) ? 'default' : 'outline'}
// //                       className={`cursor-pointer transition-colors ${
// //                         interests.includes(interest) 
// //                           ? 'bg-orange-500 text-white hover:bg-orange-600' 
// //                           : 'hover:bg-orange-50 hover:text-orange-600'
// //                       }`}
// //                       onClick={() => toggleInterest(interest)}
// //                       data-testid={`interest-${interest}`}
// //                     >
// //                       {interest}
// //                     </Badge>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Submit Button */}
// //               <div className="pt-4">
// //                 <Button 
// //                   onClick={handlePlanTrip}
// //                   disabled={planningTrip}
// //                   className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg"
// //                   data-testid="orchestrate-trip-btn"
// //                 >
// //                   {planningTrip ? (
// //                     <>
// //                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
// //                       Agents are collaborating...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <i className="fas fa-magic mr-2"></i>
// //                       Orchestrate the Perfect Tour
// //                     </>
// //                   )}
// //                 </Button>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* Previous Trips */}
// //         <div>
// //           <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Grand Tours</h3>
// //           {trips.length === 0 ? (
// //             <Card className="bg-white/70 backdrop-blur-sm" data-testid="no-trips-message">
// //               <CardContent className="text-center py-12">
// //                 <i className="fas fa-compass text-6xl text-gray-300 mb-4"></i>
// //                 <h4 className="text-xl font-semibold text-gray-600 mb-2">No adventures yet!</h4>
// //                 <p className="text-gray-500">Create your first trip plan and let our agents work their magic.</p>
// //               </CardContent>
// //             </Card>
// //           ) : (
// //             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="trips-grid">
// //               {trips.map((trip) => (
// //                 <Card 
// //                   key={trip.id} 
// //                   className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105"
// //                   onClick={() => navigate(`/trip/${trip.id}`)}
// //                   data-testid={`trip-card-${trip.id}`}
// //                 >
// //                   <CardHeader>
// //                     <div className="flex items-center justify-between">
// //                       <CardTitle className="text-lg font-bold text-gray-900">
// //                         <i className="fas fa-map-marker-alt text-orange-500 mr-2"></i>
// //                         {trip.request.destination}
// //                       </CardTitle>
// //                       <div className={`w-3 h-3 rounded-full ${getStatusColor(trip.status)}`} data-testid={`trip-status-${trip.id}`}></div>
// //                     </div>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-2 text-sm text-gray-600">
// //                       <p>
// //                         <i className="fas fa-calendar mr-2"></i>
// //                         {trip.request.start_date} to {trip.request.end_date}
// //                       </p>
// //                       <p>
// //                         <i className="fas fa-users mr-2"></i>
// //                         {trip.request.travelers_count} traveler{trip.request.travelers_count > 1 ? 's' : ''}
// //                       </p>
// //                       <p>
// //                         <i className="fas fa-dollar-sign mr-2"></i>
// //                         {trip.request.budget_range} budget
// //                       </p>
// //                       {trip.request.interests.length > 0 && (
// //                         <div className="flex flex-wrap gap-1 mt-3">
// //                           {trip.request.interests.slice(0, 3).map((interest) => (
// //                             <Badge key={interest} variant="secondary" className="text-xs">
// //                               {interest}
// //                             </Badge>
// //                           ))}
// //                           {trip.request.interests.length > 3 && (
// //                             <Badge variant="secondary" className="text-xs">
// //                               +{trip.request.interests.length - 3}
// //                             </Badge>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                     <div className="mt-4">
// //                       <Badge 
// //                         variant={trip.status === 'completed' ? 'default' : trip.status === 'processing' ? 'secondary' : 'destructive'}
// //                         className="text-xs"
// //                       >
// //                         {trip.status}
// //                       </Badge>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/authContext';
// import toast from 'react-hot-toast';
// import { FaTrash, FaPlus, FaCalculator, FaRoute } from 'react-icons/fa';
// import { Button } from './ui/button'; // Assuming you have this component for the header button

// // A simple loading spinner component
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-full py-10">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//   </div>
// );

// // --- Main Merged Dashboard Component ---
// export default function Dashboard({ onLogout }) { // Accepts onLogout prop for the header button
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [trips, setTrips] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // --- Effect to Fetch User's Saved Trips from the Database ---
//   useEffect(() => {
//     const fetchTrips = async () => {
//       if (!user?.token) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/itinerary/my-trips`,
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         );

//         if (!res.ok) throw new Error("Failed to fetch your saved trips.");
//         const data = await res.json();
//         setTrips(data.itineraries || []);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTrips();
//   }, [user]);

//   // --- Function to perform the actual deletion after confirmation ---
//   const performDeletion = async (tripId) => {
//     setDeletingId(tripId);
//     const deletePromise = fetch(
//       `${import.meta.env.VITE_API_BASE_URL}/itinerary/${tripId}`,
//       {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${user.token}` },
//       }
//     );

//     await toast.promise(deletePromise, {
//       loading: "Deleting trip...",
//       success: () => {
//         setTrips((currentTrips) => currentTrips.filter((trip) => trip._id !== tripId));
//         return "Trip deleted successfully!";
//       },
//       error: "Failed to delete trip.",
//     });

//     setDeletingId(null);
//   };

//   // --- Shows a confirmation toast before deleting ---
//   const handleDeleteTrip = (e, tripId) => {
//     e.stopPropagation();
//     toast((t) => (
//       <div className="flex flex-col items-center gap-3 p-2">
//         <p className="font-semibold text-center">Are you sure you want to delete this trip?</p>
//         <div className="flex gap-4">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               performDeletion(tripId);
//             }}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
//           >
//             Confirm
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), { duration: 5000 });
//   };

//   // --- RENDER-GATE for Authentication ---
//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
//         <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-6">Please sign in to view your dashboard and saved trips.</p>
//           <Link to="/signin">
//             <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
//               Go to Sign In
//             </button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // --- Main Dashboard Render ---
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
//       <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
//                 <i className="fas fa-magic"></i>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
//                 <p className="text-sm text-gray-600">Grand Orchestrator Dashboard</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <img 
//                   src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff`} 
//                   alt={user.fullname} 
//                   className="w-8 h-8 rounded-full"
//                   data-testid="user-avatar"
//                 />
//                 <span className="text-gray-700 font-medium" data-testid="user-name">{user.fullname}</span>
//               </div>
//               <Button 
//                 onClick={onLogout} 
//                 variant="outline"
//                 className="border-orange-200 text-orange-700 hover:bg-orange-50"
//                 data-testid="logout-btn"
//               >
//                 <i className="fas fa-sign-out-alt mr-2"></i>
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
//         {/* Welcome Section */}
//         <div className="text-center md:text-left">
//           <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}! 🗺️</h2>
//           <p className="text-lg text-gray-600">Ready to plan your next adventure?</p>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <Link to="/generate" className="w-full">
//             <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
//               <FaPlus /> Generate New Itinerary
//             </button>
//           </Link>
//           <Link to="/cost" className="w-full">
//             <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
//               <FaCalculator /> Estimate Route Cost
//             </button>
//           </Link>
//         </div>

//         {/* Saved Trips Section */}
//         <div className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl p-6 md:p-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//             <FaRoute /> My Saved Trips
//           </h2>
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : trips.length === 0 ? (
//             <div className="text-center py-10 px-4">
//               <h3 className="text-xl font-semibold text-gray-700">No Trips Found</h3>
//               <p className="text-gray-500 mt-2">You haven't saved any itineraries yet. Let's plan your next adventure!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {trips.map((trip) => (
//                 <div
//                   key={trip._id}
//                   onClick={() => navigate(`/my-trips/${trip._id}`)} // Corrected Navigation Path
//                   className="bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between"
//                 >
//                   <div className="p-5">
//                     <h3 className="text-xl font-bold text-gray-800 truncate">{trip.destinationName}</h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Created on: {new Date(trip.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-3 flex justify-end border-t">
//                     <button
//                       onClick={(e) => handleDeleteTrip(e, trip._id)}
//                       disabled={deletingId === trip._id}
//                       className="text-red-500 hover:text-red-700 disabled:text-gray-400 p-2 rounded-full hover:bg-red-50 transition-colors"
//                       title="Delete Trip"
//                     >
//                       {deletingId === trip._id ? (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
//                       ) : (
//                         <FaTrash />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/authContext';
// import toast from 'react-hot-toast';
// import { FaTrash, FaPlus, FaCalculator } from 'react-icons/fa';
// import { MapPin, Calendar, Clock, Sparkles, Globe, TrendingUp } from 'lucide-react';
// import { Button } from './ui/button'; // Your header button

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-full py-10">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//   </div>
// );

// export default function Dashboard({ onLogout }) {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [trips, setTrips] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       if (!user?.token) {
//         setIsLoading(false);
//         return;
//       }
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/my-trips`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch your saved trips.");
//         const data = await res.json();
//         setTrips(data.itineraries || []);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTrips();
//   }, [user]);

//   const performDeletion = async (tripId) => {
//     setDeletingId(tripId);
//     const deletePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/itinerary/${tripId}`, {
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${user.token}` },
//     });

//     await toast.promise(deletePromise, {
//       loading: 'Deleting trip...',
//       success: () => {
//         setTrips((cur) => cur.filter((t) => t._id !== tripId));
//         return 'Trip deleted successfully!';
//       },
//       error: 'Failed to delete trip.',
//     });

//     setDeletingId(null);
//   };

//   const handleDeleteTrip = (e, tripId) => {
//     e.stopPropagation();
//     toast((t) => (
//       <div className="flex flex-col items-center gap-3 p-2">
//         <p className="font-semibold text-center">Are you sure you want to delete this trip?</p>
//         <div className="flex gap-4">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               performDeletion(tripId);
//             }}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
//           >
//             Confirm
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), { duration: 5000 });
//   };

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
//         <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-6">Please sign in to view your dashboard and saved trips.</p>
//           <Link to="/signin">
//             <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
//               Go to Sign In
//             </button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
//               <i className="fas fa-magic"></i>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
//               <p className="text-sm text-gray-600">Grand Orchestrator Dashboard</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-3">
//               <img
//                 src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff`}
//                 alt={user.fullname}
//                 className="w-8 h-8 rounded-full"
//               />
//               <span className="text-gray-700 font-medium">{user.fullname}</span>
//             </div>
//             <Button onClick={onLogout} variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
//               <i className="fas fa-sign-out-alt mr-2"></i> Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Welcome Section */}
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
//         <div className="text-center md:text-left">
//           <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}! 🗺️</h2>
//           <p className="text-lg text-gray-600">Ready to plan your next adventure?</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <Link to="/generate">
//             <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
//               <FaPlus /> Generate New Itinerary
//             </button>
//           </Link>
//           <Link to="/cost">
//             <button className="w-full text-lg py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center gap-3">
//               <FaCalculator /> Estimate Route Cost
//             </button>
//           </Link>
//         </div>

//         {/* --- NEW Prettier Trips Section --- */}
//         <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-2xl rounded-3xl p-8 md:p-10">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md">
//                 <MapPin className="w-6 h-6" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900">My Saved Trips</h2>
//                 <p className="text-gray-600">Explore your adventure collection</p>
//               </div>
//             </div>
//           </div>

//           {isLoading ? (
//             <LoadingSpinner />
//           ) : trips.length === 0 ? (
//             <div className="text-center py-16 px-4">
//               <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <MapPin className="w-12 h-12 text-orange-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-3">No Trips Found</h3>
//               <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
//                 You haven't saved any itineraries yet. Start planning your dream adventure today!
//               </p>
//               <button
//                 onClick={() => navigate('/generate')}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
//               >
//                 <FaPlus className="w-5 h-5" />
//                 Create Your First Trip
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {trips.map((trip) => (
//                 <div
//                   key={trip._id}
//                   onClick={() => navigate(`/my-trips/${trip._id}`)}
//                   className="group bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 rounded-2xl shadow-md cursor-pointer hover:shadow-2xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
//                 >
//                   <div className="relative p-6">
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full -mr-16 -mt-16"></div>
//                     <div className="relative">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
//                           <MapPin className="w-6 h-6" />
//                         </div>
//                       </div>
//                       <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
//                         {trip.destinationName}
//                       </h3>
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Calendar className="w-4 h-4" />
//                         <span>{new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 flex justify-between items-center border-t-2 border-orange-100">
//                     <span className="text-sm font-semibold text-orange-700 flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       View Details
//                     </span>
//                     <button
//                       onClick={(e) => handleDeleteTrip(e, trip._id)}
//                       disabled={deletingId === trip._id}
//                       className="text-red-500 hover:text-red-700 disabled:text-gray-400 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110"
//                       title="Delete Trip"
//                     >
//                       {deletingId === trip._id ? (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
//                       ) : (
//                         <FaTrash className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      if (!user?.token) { setIsLoading(false); return; }
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
    if (!routes?.length) return { avgDistance: "N/A", avgDuration: "N/A" };
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
      success: () => { setTrips(cur => cur.filter(t => t._id !== tripId)); return 'Trip deleted successfully!'; },
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
          <button onClick={() => { toast.dismiss(t.id); performDeletion(tripId); }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">Confirm</button>
          <button onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitAdventure = async (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.startDate || !formData.endDate) {
      toast.error("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    setSummary(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to plan adventure.");
      const data = await res.json();
      setSummary(data.tripPlan || null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your dashboard and saved trips.</p>
        <Link to="/signin">
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg">Go to Sign In</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold"><i className="fas fa-magic"></i></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ringmaster's Roundtable</h1>
              <p className="text-sm text-gray-600">Grand Orchestrator Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff`} alt={user.fullname} className="w-8 h-8 rounded-full"/>
              <span className="text-gray-700 font-medium">{user.fullname}</span>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}! 🗺️</h2>
          <p className="text-lg text-gray-600">Ready to plan your next adventure?</p>
        </div>

        {/* Action Buttons: Plan first, then Generate, Compare, Cost */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
            <FaPlus /> Plan New Adventure
          </button>
          <Link to="/generate">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
              <FaPlus /> Generate Itinerary
            </button>
          </Link>
          <Link to="/compare">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
              <FaBalanceScale /> Compare Places
            </button>
          </Link>
          <Link to="/cost">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
              <FaCalculator /> Estimate Route Cost
            </button>
          </Link>
        </div>

        {/* Plan Adventure Modal */}
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
              {summary && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-gray-800">
                  <h4 className="font-semibold mb-2">Adventure Summary:</h4>
                  <p>Estimated Cost: ₹{summary.estimatedCost}</p>
                  <p>Weather: {summary.agents.weather?.description || "not available"}</p>
                  <p>Events: {summary.agents.events?.length ? summary.agents.events.slice(0, 3).map(ev => ev.name).join(", ") : "none found"}</p>
                  {summary.agents.map?.length > 0 && (
                    <>
                      <p>Routes: {summary.agents.map.length}</p>
                      <p>Average Distance: {computeAverages(summary.agents.map).avgDistance} km</p>
                      <p>Average Duration: {computeAverages(summary.agents.map).avgDuration} hrs</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trips Section */}
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

          {isLoading ? <LoadingSpinner /> : trips.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">No Trips Found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">You haven't saved any itineraries yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => {
                const routes = trip.agents?.map || [];
                const { avgDistance, avgDuration } = computeAverages(routes);
                return (
                  <div key={trip._id} onClick={() => navigate(`/my-trips/${trip._id}`)} className="group bg-gradient-to-br from-white to-orange-50/30 border-2 border-orange-100 rounded-2xl shadow-md cursor-pointer hover:shadow-2xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
                    <div className="relative p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.destinationName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
                      </div>
                      {routes.map((route, i) => (
                        <div key={i} className="text-sm text-gray-500">
                          Route {i+1}: {route.distance}, {route.duration}
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 flex justify-between items-center border-t-2 border-orange-100">
                      <span className="text-sm font-semibold text-orange-700 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> View Details
                      </span>
                      <button onClick={(e) => handleDeleteTrip(e, trip._id)} disabled={deletingId === trip._id} className="text-red-500 hover:text-red-700 disabled:text-gray-400 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110" title="Delete Trip">
                        {deletingId === trip._id ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div> : <FaTrash className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
