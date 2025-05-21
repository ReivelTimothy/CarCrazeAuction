// components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">CAR CRAZE AUCTION</h1>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
