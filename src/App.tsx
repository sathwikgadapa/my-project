/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RiderApp from './pages/RiderApp';
import NgoDashboard from './pages/NgoDashboard';

// Simple Error Boundary
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Annapurna...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/rider" element={<RiderApp />} />
          <Route path="/ngo" element={<NgoDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

