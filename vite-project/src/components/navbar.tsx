import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Car, Heart, Menu, LogOut, Bell, User, Gavel, X,
  ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import '../styles/navbar.css';

interface User {
  user_id: string;
  username: string;
  email: string;
  avatar?: string;
  notifications?: number;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user from localStorage or API
    // For demo purposes, always show user as logged in
    setUser({
      user_id: '1',
      username: 'John Doe',
      email: 'john@example.com',
      notifications: 3
    });

    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Handle clicks outside of user menu to close it
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Car size={20} />
          </div>
          <span>CarCraze</span>
        </NavLink>

        {/* Navigation Links */}
        <div className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="navbar-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/auctions" 
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Live Auctions
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/vehicles" 
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Vehicles
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
          
          {/* Mobile Only Auth Buttons */}
          <div className="mobile-auth-buttons">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="mobile-user-name">{user.username}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <NavLink to="/dashboard" className="mobile-nav-link">
                  <User size={18} />
                  <span>My Profile</span>
                </NavLink>
                <NavLink to="/dashboard?tab=my-bids" className="mobile-nav-link">
                  <Gavel size={18} />
                  <span>My Bids</span>
                </NavLink>
                <NavLink to="/dashboard?tab=watching" className="mobile-nav-link">
                  <Heart size={18} />
                  <span>Watchlist</span>
                </NavLink>
                <NavLink to="/dashboard?tab=notifications" className="mobile-nav-link">
                  <Bell size={18} />
                  <span>Notifications</span>
                  {user.notifications && user.notifications > 0 && (
                    <span className="mobile-badge">{user.notifications}</span>
                  )}
                </NavLink>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="mobile-auth-btn login">
                  Login
                </NavLink>
                <NavLink to="/register" className="mobile-auth-btn register">
                  Register
                </NavLink>
              </>
            )}
          </div>
          
          {/* Close button for mobile menu */}
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <form onSubmit={handleSearch} className="navbar-search">
            <Search size={18} className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search auctions, vehicles..."
              className="navbar-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile Search Button */}
          <button 
            className="mobile-search-btn"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <Search size={18} />
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <NavLink 
                to="/dashboard?tab=notifications" 
                className="navbar-btn navbar-btn-secondary navbar-notifications"
              >
                <Bell size={18} />
                {user.notifications && user.notifications > 0 && (
                  <span className="notification-badge">{user.notifications}</span>
                )}
              </NavLink>

              {/* User Profile */}
              <div className="navbar-user-dropdown" ref={userMenuRef}>
                <button 
                  className="navbar-user" 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="navbar-user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="navbar-user-info">
                    <div className="navbar-user-name">{user.username}</div>
                    <div className="navbar-user-role">Bidder</div>
                  </div>
                  {isUserMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <NavLink to="/dashboard" className="dropdown-item">
                      <User size={16} />
                      <span>My Dashboard</span>
                    </NavLink>
                    <NavLink to="/dashboard?tab=my-bids" className="dropdown-item">
                      <Gavel size={16} />
                      <span>My Bids</span>
                    </NavLink>
                    <NavLink to="/dashboard?tab=watching" className="dropdown-item">
                      <Heart size={16} />
                      <span>Watchlist</span>
                    </NavLink>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-btn navbar-btn-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="navbar-btn">
                Register
              </NavLink>
            </>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`navbar-search-overlay ${isMobileSearchOpen ? 'active' : ''}`}>
        <div className="search-overlay-header">
          <button 
            onClick={() => setIsMobileSearchOpen(false)}
            className="search-overlay-close"
          >
            <ArrowLeft size={20} />
          </button>
          <h3>Search</h3>
        </div>
        <form onSubmit={(e) => {
          handleSearch(e);
          setIsMobileSearchOpen(false);
        }} className="search-overlay-form">
          <input
            type="text"
            placeholder="Search auctions, vehicles..."
            className="search-overlay-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
