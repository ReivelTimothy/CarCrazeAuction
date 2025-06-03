import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../services/authService';
import { getUserParticipatedAuctions, getUserWonAuctions, getAdminStatistics } from '../services/auctionService';
import { checkDatabaseIntegrity, fixDatabaseIntegrity, processExpiredAuctions } from '../services/databaseService';
import { formatIntegrityResults, formatIntegrityFixResults, formatExpiredAuctionsResults } from '../utils/adminUtils';
import type { Auction, AdminStatistics } from '../types/types';
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
  const [participatedAuctions, setParticipatedAuctions] = useState<Auction[]>([]);
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  // Database tools loading states
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [fixingIntegrity, setFixingIntegrity] = useState(false);
  const [processingAuctions, setProcessingAuctions] = useState(false);
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
        
        // Fetch role-specific data
        if (user?.role === 'admin') {
          // Fetch admin statistics
          const stats = await getAdminStatistics();
          setAdminStats(stats);
        } else {
          // Fetch user auction participation data
          const [participated, won] = await Promise.all([
            getUserParticipatedAuctions(),
            getUserWonAuctions()
          ]);
          setParticipatedAuctions(participated);
          setWonAuctions(won);
        }
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.role]);
  
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
          )}        </div>
          {/* Role-based content rendering */}
        {!user?.role && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile data...</p>
          </div>
        )}
        {user?.role === 'admin' ? (
          // Admin Dashboard
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {adminStats ? (
              <div className="admin-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Auctions</h3>
                    <p className="stat-number">{adminStats.totalAuctions}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Active Auctions</h3>
                    <p className="stat-number">{adminStats.activeAuctions}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">${adminStats.totalRevenue}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Bids</h3>
                    <p className="stat-number">{adminStats.totalBids}</p>
                  </div>                </div>
                  <div className="admin-actions">
                  <button onClick={() => navigate('/create-auction')} className="btn btn-primary admin-action-btn">
                    <i className="fa fa-plus-circle"></i> Create New Auction
                  </button>
                  <button onClick={() => navigate('/admin/manage')} className="btn btn-secondary admin-action-btn">
                    <i className="fa fa-cog"></i> Manage Auctions
                  </button>
                </div>
                
                <div className="admin-sections">
                  <div className="recent-auctions">
                    <h3>Recent Auctions</h3>
                    {adminStats.recentAuctions.length > 0 ? (
                      <div className="auctions-list">
                        {adminStats.recentAuctions.map(auction => (
                          <div key={auction.auction_id} className="auction-item" onClick={() => navigate(`/auction/${auction.auction_id}`)}>
                            <h4>{auction.title}</h4>
                            <div className="auction-item-details">
                              <span className="auction-price">${auction.currentPrice.toLocaleString()}</span>
                              <span className={`auction-status status-${auction.status}`}>
                                {auction.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No recent auctions found.</p>
                    )}
                  </div>
                  
                  <div className="active-auctions">
                    <h3>Active Auctions with Bids</h3>
                    {adminStats.activeAuctionsWithBids.length > 0 ? (
                      <div className="auctions-list">
                        {adminStats.activeAuctionsWithBids.map(auction => (
                          <div key={auction.auction_id} className="auction-item" onClick={() => navigate(`/auction/${auction.auction_id}`)}>
                            <h4>{auction.title}</h4>
                            <div className="auction-item-details">
                              <span className="auction-price">${auction.currentPrice.toLocaleString()}</span>
                              <span className="bid-count">{auction.bidCount} bids</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No active auctions with bids found.</p>
                    )}
                  </div>
                </div>
                
                {/* Recent Bid Activity Section */}
                <div className="recent-bid-activity">
                  <h3>Recent Bid Activity</h3>
                  {adminStats.recentBids && adminStats.recentBids.length > 0 ? (
                    <div className="bid-activity-list">
                      {adminStats.recentBids.map(bid => (
                        <div key={bid.bid_id} className="bid-activity-item">
                          <div className="bid-activity-details">                            <div className="bid-user">
                              <span className="user-icon"></span>
                              <span className="user-id">{bid.user?.username || `User ${bid.user_id}`}</span>
                            </div>
                            <div className="bid-info">
                              <span className="bid-amount">${bid.amount.toLocaleString()}</span>
                              <span className="bid-auction">on {bid.auction_title}</span>
                              <span className="bid-time">{new Date(bid.bidTime).toLocaleString()}</span>
                            </div>
                          </div>
                          <button 
                            className="view-auction-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/auction/${bid.auction_id}`);
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No recent bid activity found.</p>
                  )}                </div>
                
                {/* Administrator Maintenance Guide */}
                <div className="maintenance-guide">
                  <h3>Administrator Database Maintenance Guide</h3>
                  <div className="guide-content">
                    <div className="guide-item">
                      <h4>Why Database Maintenance Matters</h4>
                      <p>Regular database maintenance ensures data consistency and system reliability. This is especially important for the auction system where transactions involve financial data.</p>
                    </div>
                    
                    <div className="guide-item">
                      <h4>Recommended Maintenance Schedule</h4>
                      <ul>
                        <li><strong>Daily:</strong> Process expired auctions to close completed auctions</li>
                        <li><strong>Weekly:</strong> Run database integrity checks</li>
                        <li><strong>Monthly:</strong> Fix any integrity issues that have been found</li>
                      </ul>
                    </div>
                    
                    <div className="guide-item">
                      <h4>Common Issues</h4>
                      <ul>
                        <li><strong>Orphaned Bids:</strong> Bids without valid user or auction references</li>
                        <li><strong>Inconsistent Transactions:</strong> Transactions missing user or auction references</li>
                        <li><strong>Incomplete Auctions:</strong> Auctions that have ended but not been processed</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Database Tools Section */}
                <div className="database-tools">
                  <h3>Database Maintenance Tools</h3>
                  <div className="tool-description">
                    <p>Use these tools to ensure data integrity across the Car Craze Auction system. Regular maintenance helps prevent inconsistencies between auctions, bids, and transactions.</p>
                  </div>
                  <div className="database-tool-actions">
                    <button
                      className="btn-tool" 
                      onClick={async () => {
                        setCheckingIntegrity(true);
                        try {
                          const results = await checkDatabaseIntegrity();
                          console.log('Database integrity results:', results);
                          if (results.error) {
                            alert(`Error during integrity check: ${results.error}`);
                          } else {
                            alert(formatIntegrityResults(results));
                          }
                        } catch (err) {
                          console.error('Database integrity check failed:', err);
                          alert(`Database integrity check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                        } finally {
                          setCheckingIntegrity(false);
                        }
                      }}
                      disabled={checkingIntegrity}
                    >
                      {checkingIntegrity ? 'Checking...' : 'Check Database Integrity'}
                    </button>
                    <button
                      className="btn-tool btn-caution" 
                      onClick={async () => {
                        if (window.confirm('⚠️ This action will remove inconsistent records from the database.\n\nAre you sure you want to proceed with fixing database integrity issues?')) {
                          setFixingIntegrity(true);
                          try {
                            const results = await fixDatabaseIntegrity();
                            console.log('Database fix results:', results);
                            if (results.error) {
                              alert(`Error fixing integrity issues: ${results.error}`);
                            } else {
                              alert(formatIntegrityFixResults(results));
                            }
                          } catch (err) {
                            console.error('Database fix failed:', err);
                            alert(`Failed to fix database integrity issues: ${err instanceof Error ? err.message : 'Unknown error'}`);
                          } finally {
                            setFixingIntegrity(false);
                          }
                        }
                      }}
                      disabled={fixingIntegrity}
                    >
                      {fixingIntegrity ? 'Fixing Issues...' : 'Fix Integrity Issues'}
                    </button>
                    <button
                      className="btn-tool btn-warning" 
                      onClick={async () => {
                        if (window.confirm('This action will close any auctions that have reached their end date and process winners.\n\nAre you sure you want to continue?')) {
                          setProcessingAuctions(true);
                          try {
                            const results = await processExpiredAuctions();
                            console.log('Expired auctions check results:', results);
                            if (results.error) {
                              alert(`Error processing expired auctions: ${results.error}`);
                            } else {
                              alert(formatExpiredAuctionsResults(results));
                            }
                          } catch (err) {
                            console.error('Expired auctions check failed:', err);
                            alert(`Failed to check expired auctions: ${err instanceof Error ? err.message : 'Unknown error'}`);
                          } finally {
                            setProcessingAuctions(false);
                          }
                        }
                      }}
                      disabled={processingAuctions}
                    >
                      {processingAuctions ? 'Processing...' : 'Process Expired Auctions'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loading-stats">
                <p>Loading admin statistics...</p>
              </div>
            )}
          </div>
        ) : (
          // User Dashboard
          <div className="user-dashboard">
            <div className="user-auction-sections">
              <div className="participated-auctions">
                <h2>Auctions I Participated In</h2>
                {participatedAuctions.length > 0 ? (
                  <div className="auctions-list">
                    {participatedAuctions.map(auction => (
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
                  </div>
                ) : (
                  <div className="no-auctions">
                    <p>You haven't participated in any auctions yet.</p>
                    <button onClick={() => navigate('/auctions')} className="btn btn-primary">
                      Browse Auctions
                    </button>
                  </div>
                )}
              </div>
              
              <div className="won-auctions">
                <h2>Auctions I Won</h2>
                {wonAuctions.length > 0 ? (
                  <div className="auctions-list">
                    {wonAuctions.map(auction => (
                      <div key={auction.auction_id} className="auction-item won-auction" onClick={() => navigate(`/auction/${auction.auction_id}`)}>
                        <h3>{auction.title}</h3>
                        <div className="auction-item-details">
                          <span className="auction-price">${auction.currentPrice}</span>
                          <span className="won-badge">WON</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-auctions">
                    <p>You haven't won any auctions yet.</p>
                    <button onClick={() => navigate('/auctions')} className="btn btn-primary">
                      Browse Auctions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;