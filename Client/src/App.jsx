import React from 'react';
import LandingPage from './components/LandingPage';

function App() {
  // Placeholder function for the login button
  const handleLogin = () => {
    alert('Login button clicked!');
  };

  return (
    <div>
      <LandingPage onLogin={handleLogin} />
    </div>
  );
}

export default App;