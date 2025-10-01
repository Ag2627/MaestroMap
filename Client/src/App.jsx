// import React from 'react';
// import { Route, Routes } from 'react-router-dom';

// // Import your page components
// import LandingPage from './components/LandingPage';
// import Signup from './components/Signup';
// import Signin from './components/Signin';
// import MapComponent from './components/MapComponent'
// import Dashboard from './components/Dashboard';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/signin" element={<Signin />} />
//       <Route path="/map" element={<MapComponent />} />
//     </Routes>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Signin from './components/Signin';
import VerifyEmail from './components/verifyEmail';
import MapComponent from './components/MapComponent'
import Dashboard from './components/Dashboard';

function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/map" element={<MapComponent />} />

      <Route 
        path="/dashboard" 
        element={user ? <Dashboard user={user} onLogout={logout} /> : <Signin />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      
        <AppRoutes />
      
    </AuthProvider>
  );
}

export default App;
