// components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-logo">
          <span>CAR CRAZE</span>
          <span className="highlight">AUCTION</span>
        </NavLink>
        
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>          
          <li className="nav-item">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
          </li>
          {isAuthenticated && user?.role === 'admin' && (
            <li className="nav-item">
              <NavLink to="/create-auction" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Create Auction
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  My Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              {user && (
                <li className="nav-item user-info">
                  <span className="username">{user.username}</span>
                </li>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
