import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../services/authService';
import { getAllAuctions } from '../services/auctionService';
import type { Auction } from '../types/types';
import '../styles/profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    phoneNum: ''
  });
  
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest user profile
        const userData = await getUserProfile();
        
        // Set form data
        setEditedUser({
          username: userData.username,
          email: userData.email,
          phoneNum: userData.phoneNum
        });
        
        // Fetch user auctions (Note: This might need backend support)
        const allAuctions = await getAllAuctions();
        // In a real application, you would filter auctions created by this user
        // Here we're just displaying all auctions as an example
        setUserAuctions(allAuctions.slice(0, 3)); // Just showing some auctions for example
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateUserProfile(editedUser);
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserProfile();
        logout();
        navigate('/login');
      } catch (err) {
        console.error('Error deleting account:', err);
        setError('Failed to delete account');
      }
    }
  };
  
  if (loading && !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="error-container">
        <p>User not found. Please log in again.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          {error && <div className="profile-error">{error}</div>}
          {updateSuccess && <div className="profile-success">{updateSuccess}</div>}
          
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {editedUser.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNum">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNum"
                  name="phoneNum"
                  value={editedUser.phoneNum}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <h3>{editedUser.username}</h3>
              </div>
              
              <div className="info-group">
                <label>Email</label>
                <p>{editedUser.email}</p>
              </div>
              
              <div className="info-group">
                <label>Phone Number</label>
                <p>{editedUser.phoneNum}</p>
              </div>
              
              <div className="profile-actions">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="user-auctions">
          <h2>My Auctions</h2>
          {userAuctions.length > 0 ? (
            <div className="auctions-list">
              {userAuctions.map(auction => (
                <div key={auction.auction_id} className="auction-item" onClick={() => navigate(`/auction/${auction.auction_id}`)}>
                  <h3>{auction.title}</h3>
                  <div className="auction-item-details">
                    <span className="auction-price">${auction.currentPrice}</span>
                    <span className={`auction-status status-${auction.status}`}>
                      {auction.status}
                    </span>
                  </div>
                </div>
              ))}
              <div className="auction-item create-new" onClick={() => navigate('/create-auction')}>
                <div className="create-icon">+</div>
                <p>Create New Auction</p>
              </div>
            </div>
          ) : (
            <div className="no-auctions">
              <p>You haven't created any auctions yet.</p>
              <button onClick={() => navigate('/create-auction')} className="btn btn-primary">
                Create Your First Auction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;