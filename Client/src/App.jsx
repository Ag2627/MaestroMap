import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import your page components
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Signin from './components/Signin';
import MapComponent from './components/MapComponent'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/map" element={<MapComponent />} />
    </Routes>
  );
}

export default App;