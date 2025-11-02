// src/layouts/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { HomeButton } from '../components/HomeButton';

const AppLayout = () => {
  return (
    <div>
    
      <main>
        <Outlet />
      </main>

      <HomeButton />
    </div>
  );
};

export default AppLayout;