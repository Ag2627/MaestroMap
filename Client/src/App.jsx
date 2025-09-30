import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import your page components
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Signin from './components/Signin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;