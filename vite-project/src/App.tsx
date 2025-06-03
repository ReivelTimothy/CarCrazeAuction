// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/navbar';
import './styles/App.css';
import AuctionDetails from './pages/auctionDetails';
import Profile from './pages/profile';
import CreateAuction from './pages/createAuction';
import TransactionDetails from './pages/transactionDetails';
import AdminPage from './pages/adminPage';

// Protected Route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <Navbar />}      <div className={`main-container ${isAuthenticated ? 'with-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />          
          <Route path="/auction/:id" element={<ProtectedRoute element={<AuctionDetails />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/create-auction" element={<ProtectedRoute element={<CreateAuction />} />} />
          <Route path="/transaction/:id" element={<ProtectedRoute element={<TransactionDetails />} />} />
          <Route path="/admin/manage" element={<ProtectedRoute element={<AdminPage />} />} />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
