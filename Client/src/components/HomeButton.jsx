// src/components/HomeButton.jsx
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomeButton = () => {
  const navigate = useNavigate();

  // Function to navigate to the dashboard/home page
  const goToHome = () => {
    navigate('/');
  };

  return (
    <button
      onClick={goToHome}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 ease-in-out"
      aria-label="Go to Home"
      title="Go to Home"
    >
      <Home size={28} />
    </button>
  );
};