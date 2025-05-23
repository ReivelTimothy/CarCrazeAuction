// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Auctions from './pages/auctions';
import AuctionDetail from './pages/auction-detail';
import Vehicles from './pages/vehicles';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  // Check authentication on app mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, clear any potentially stale user data
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/vehicles" element={<Vehicles />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
