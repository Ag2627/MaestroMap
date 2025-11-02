import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from './components/LandingPage';
//import HotelPage from "./components/HotelsPage";  
import { HotelsFormPage } from './components/HotelsPage.jsx';
import Signup from './components/Signup';
import Signin from './components/Signin';
import VerifyEmail from './components/verifyEmail';
import RoutePlanner from './components/RoutePlanner';
import Dashboard from './components/Dashboard';
import OpenTripPlaces from "./components/OpenTripPlaces";
import GooglePlaces from "./components/GooglePlaces";
import Hotels from "./components/Hotels";
import  { WeatherPage } from "./components/WeatherPage";
import EventPage from "./components/EventPage";
import TripDashboard from "./components/TripDashBoard";
import PlacesHotelFood from "./temporary/PlacesHotelFood";
import ItineraryGenerator from "./temporary/ItineraryGenerator";
import MyTrips from "./temporary/MyTrips";
import TripDetails from "./temporary/TripDetails";
import AppLayout from './pages/AppLayout';
import CostEstimator from './components/CostEstimator';
import Comparison from './temporary/TripComparision';
function AppRoutes() {
  const { user, logout } = useAuth();


  return (
     <Routes>
      {/*  Routes on which hoe not required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Routes with home button */}
      <Route element={<AppLayout />}>
        <Route path="/placeshotels" element={<PlacesHotelFood />} />
        <Route path="/generate" element={<ItineraryGenerator />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/my-trips/:tripId" element={<TripDetails />} />
        <Route path="/findroutes" element={<RoutePlanner />} />
        <Route path="/openplaces" element={<OpenTripPlaces />} />
        <Route path="/googleplaces" element={<GooglePlaces />} />
        <Route path="/hotels" element={<HotelsFormPage />} />
        <Route path="/tripdash" element={<TripDashboard />} />
        <Route path="/weatherDetails" element={<WeatherPage />} />
        <Route path="/eventDetails" element={<EventPage />} />
        <Route path="/cost" element={<CostEstimator />} />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={logout} /> : <Signin />} 
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
   <AuthProvider>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
