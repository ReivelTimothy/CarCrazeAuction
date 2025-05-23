import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Clock, Tag, Car, Settings, Bell, LogOut, 
  Star, Heart, Gavel, ArrowRight, CalendarClock, 
  BadgeCheck, AlertTriangle, CheckCheck, X
} from 'lucide-react';
import Navbar from '../components/navbar';
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import '../styles/dashboard.css';

interface Bid {
  bid_id: string;
  auction_id: string;
  user_id: string;
  bidAmount: number;
  bidTime: string;
  isWinning: boolean;
  auction: {
    title: string;
    endDate: string;
    status: string;
    image: string;
    currentPrice: number;
    vehicle: {
      brand: string;
      model: string;
      year: number;
    };
  };
}

interface Notification {
  id: string;
  type: 'outbid' | 'auction-ending' | 'auction-won' | 'payment' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  auction_id?: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-bids' | 'watching' | 'won' | 'profile' | 'notifications'>('my-bids');
  const [bids, setBids] = useState<Bid[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [wonAuctions, setWonAuctions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joined: '2024-12-01T10:30:00Z',
    bidCount: 32,
    wonAuctions: 5,
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        const mockBids: Bid[] = [
          {
            bid_id: '1',
            auction_id: '1',
            user_id: 'user123',
            bidAmount: 295000,
            bidTime: '2025-05-22T15:30:00Z',
            isWinning: true,
            auction: {
              title: '2023 Ferrari 488 GTB',
              endDate: '2025-05-25T18:00:00Z',
              status: 'live',
              image: '/api/placeholder/800/600',
              currentPrice: 295000,
              vehicle: {
                brand: 'Ferrari',
                model: '488 GTB',
                year: 2023,
              }
            }
          },
          {
            bid_id: '2',
            auction_id: '2',
            user_id: 'user123',
            bidAmount: 65000,
            bidTime: '2025-05-21T12:30:00Z',
            isWinning: false,
            auction: {
              title: '1967 Ford Mustang Fastback',
              endDate: '2025-05-26T20:00:00Z',
              status: 'live',
              image: '/api/placeholder/800/600',
              currentPrice: 67500,
              vehicle: {
                brand: 'Ford',
                model: 'Mustang Fastback',
                year: 1967
              }
            }
          },
          {
            bid_id: '3',
            auction_id: '3',
            user_id: 'user123',
            bidAmount: 118000,
            bidTime: '2025-05-22T13:15:00Z',
            isWinning: false,
            auction: {
              title: '2024 Tesla Model S Plaid',
              endDate: '2025-05-27T15:00:00Z',
              status: 'live',
              image: '/api/placeholder/800/600',
              currentPrice: 120000,
              vehicle: {
                brand: 'Tesla',
                model: 'Model S Plaid',
                year: 2024
              }
            }
          }
        ];

        const mockWatchlist = [
          {
            auction_id: '4',
            title: '2023 Porsche 911 Turbo S',
            endDate: '2025-05-24T16:00:00Z',
            status: 'live',
            image: '/api/placeholder/800/600',
            currentPrice: 210000,
            bidCount: 42,
            vehicle: {
              brand: 'Porsche',
              model: '911 Turbo S',
              year: 2023
            }
          },
          {
            auction_id: '5',
            title: '2022 Lamborghini Huracan Evo',
            endDate: '2025-05-29T14:00:00Z',
            status: 'upcoming',
            image: '/api/placeholder/800/600',
            currentPrice: 330000,
            bidCount: 0,
            vehicle: {
              brand: 'Lamborghini',
              model: 'Huracan Evo',
              year: 2022
            }
          }
        ];

        const mockWonAuctions = [
          {
            auction_id: '101',
            title: '2021 BMW M4 Competition',
            endDate: '2025-04-15T16:00:00Z',
            status: 'ended',
            image: '/api/placeholder/800/600',
            finalPrice: 85000,
            paymentStatus: 'completed',
            deliveryStatus: 'scheduled',
            vehicle: {
              brand: 'BMW',
              model: 'M4 Competition',
              year: 2021
            }
          }
        ];

        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'outbid',
            title: 'You have been outbid',
            message: 'Someone has outbid you on the 1967 Ford Mustang Fastback.',
            date: '2025-05-21T14:30:00Z',
            read: false,
            auction_id: '2'
          },
          {
            id: '2',
            type: 'auction-ending',
            title: 'Auction ending soon',
            message: 'The auction for Porsche 911 Turbo S is ending in 24 hours.',
            date: '2025-05-23T16:00:00Z',
            read: false,
            auction_id: '4'
          },
          {
            id: '3',
            type: 'auction-won',
            title: 'Congratulations! You won an auction',
            message: 'You have successfully won the BMW M4 Competition auction.',
            date: '2025-04-15T16:05:00Z',
            read: true,
            auction_id: '101'
          },
          {
            id: '4',
            type: 'system',
            title: 'Welcome to Car Craze Auction',
            message: 'Thank you for joining our premium car auction platform.',
            date: '2025-01-10T10:30:00Z',
            read: true
          }
        ];

        setBids(mockBids);
        setWatchlist(mockWatchlist);
        setWonAuctions(mockWonAuctions);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'my-bids':
        return (
          <div className="dashboard-content">
            <h2 className="content-title">My Bids</h2>
            {bids.length === 0 ? (
              <div className="empty-state">
                <Gavel size={64} />
                <h3>No bids yet</h3>
                <p>You haven't placed any bids yet. Start bidding on your favorite vehicles!</p>
                <Link to="/auctions" className="action-btn">
                  Browse Auctions
                </Link>
              </div>
            ) : (
              <div className="bids-list">
                {bids.map((bid) => (
                  <div key={bid.bid_id} className={`bid-card ${bid.isWinning ? 'winning' : ''}`}>
                    <div className="bid-status">
                      {bid.isWinning ? (
                        <div className="winning-indicator">
                          <BadgeCheck size={20} />
                          <span>Winning</span>
                        </div>
                      ) : (
                        <div className="outbid-indicator">
                          <AlertTriangle size={20} />
                          <span>Outbid</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bid-image">
                      <img
                        src={bid.auction.image}
                        alt={bid.auction.title}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                    
                    <div className="bid-details">
                      <h3 className="bid-auction-title">
                        <Link to={`/auction/${bid.auction_id}`}>
                          {bid.auction.title}
                        </Link>
                      </h3>
                      
                      <div className="bid-info-row">
                        <div className="bid-info-col">
                          <span className="bid-label">Your Bid</span>
                          <span className="bid-value">{formatPrice(bid.bidAmount)}</span>
                        </div>
                        
                        <div className="bid-info-col">
                          <span className="bid-label">Current Price</span>
                          <span className="bid-value">{formatPrice(bid.auction.currentPrice)}</span>
                        </div>
                        
                        <div className="bid-info-col">
                          <span className="bid-label">Ends In</span>
                          <div className="countdown">
                            <Clock size={14} />
                            <span>{formatTimeRemaining(bid.auction.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bid-footer">
                        <span className="bid-time">Bid placed on {formatDate(bid.bidTime)}</span>
                        
                        <Link to={`/auction/${bid.auction_id}`} className="bid-action">
                          {bid.isWinning ? 'View Auction' : 'Place New Bid'}
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'watching':
        return (
          <div className="dashboard-content">
            <h2 className="content-title">Watchlist</h2>
            {watchlist.length === 0 ? (
              <div className="empty-state">
                <Heart size={64} />
                <h3>Your watchlist is empty</h3>
                <p>Add auctions to your watchlist to keep track of them</p>
                <Link to="/auctions" className="action-btn">
                  Browse Auctions
                </Link>
              </div>
            ) : (
              <div className="watchlist-grid">
                {watchlist.map((auction) => (
                  <Link
                    key={auction.auction_id}
                    to={`/auction/${auction.auction_id}`}
                    className="watch-card"
                  >
                    <div className="watch-image">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/300';
                        }}
                      />
                      <span className={`watch-status ${auction.status}`}>
                        {auction.status === 'live' ? 'Live' : auction.status === 'upcoming' ? 'Upcoming' : 'Ended'}
                      </span>
                    </div>
                    
                    <div className="watch-info">
                      <h3 className="watch-title">{auction.title}</h3>
                      <div className="watch-details">
                        <div className="watch-price">
                          <span className="detail-label">Current Bid</span>
                          <span className="detail-value">{formatPrice(auction.currentPrice)}</span>
                        </div>
                        <div className="watch-time">
                          <span className="detail-label">Ends In</span>
                          <div className="countdown">
                            <Clock size={14} />
                            <span>{formatTimeRemaining(auction.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="watch-bids">
                        <Gavel size={14} />
                        <span>{auction.bidCount} bids</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'won':
        return (
          <div className="dashboard-content">
            <h2 className="content-title">Won Auctions</h2>
            {wonAuctions.length === 0 ? (
              <div className="empty-state">
                <Star size={64} />
                <h3>No won auctions yet</h3>
                <p>Items you win in auctions will appear here</p>
                <Link to="/auctions" className="action-btn">
                  Browse Auctions
                </Link>
              </div>
            ) : (
              <div className="won-auctions-list">
                {wonAuctions.map((auction) => (
                  <div key={auction.auction_id} className="won-auction-card">
                    <div className="won-auction-image">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                    
                    <div className="won-auction-details">
                      <h3 className="won-auction-title">
                        <Link to={`/auction/${auction.auction_id}`}>
                          {auction.title}
                        </Link>
                      </h3>
                      
                      <div className="won-auction-info">
                        <div className="info-item">
                          <span className="info-label">Final Price</span>
                          <span className="info-value">{formatPrice(auction.finalPrice)}</span>
                        </div>
                        
                        <div className="info-item">
                          <span className="info-label">Won On</span>
                          <span className="info-value">{formatDate(auction.endDate)}</span>
                        </div>
                      </div>
                      
                      <div className="won-auction-status">
                        <div className={`status-item ${auction.paymentStatus === 'completed' ? 'completed' : 'pending'}`}>
                          <span className="status-label">Payment</span>
                          <span className="status-value">
                            {auction.paymentStatus === 'completed' ? (
                              <>
                                <CheckCheck size={16} />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock size={16} />
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className={`status-item ${auction.deliveryStatus === 'delivered' ? 'completed' : auction.deliveryStatus === 'scheduled' ? 'scheduled' : 'pending'}`}>
                          <span className="status-label">Delivery</span>
                          <span className="status-value">
                            {auction.deliveryStatus === 'delivered' ? (
                              <>
                                <CheckCheck size={16} />
                                Delivered
                              </>
                            ) : auction.deliveryStatus === 'scheduled' ? (
                              <>
                                <CalendarClock size={16} />
                                Scheduled
                              </>
                            ) : (
                              <>
                                <Clock size={16} />
                                Processing
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'profile':
        return (
          <div className="dashboard-content">
            <h2 className="content-title">Profile</h2>
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">{getInitials(user.name)}</div>
                  )}
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{user.name}</h3>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-joined">
                    Member since {new Date(user.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-value">{user.bidCount}</span>
                    <span className="stat-label">Bids Placed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{user.wonAuctions}</span>
                    <span className="stat-label">Auctions Won</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-settings">
                <h3 className="settings-title">Account Settings</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      defaultValue={user.name}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={user.email}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Change Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter new password"
                      className="form-input"
                    />
                  </div>
                  <button className="save-btn">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="dashboard-content">
            <div className="notifications-header">
              <h2 className="content-title">Notifications</h2>
              {notifications.length > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={markAllNotificationsAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={64} />
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      {notification.type === 'outbid' && <Gavel size={20} />}
                      {notification.type === 'auction-ending' && <Clock size={20} />}
                      {notification.type === 'auction-won' && <Star size={20} />}
                      {notification.type === 'payment' && <Tag size={20} />}
                      {notification.type === 'system' && <Bell size={20} />}
                    </div>
                    
                    <div className="notification-content">
                      <h3 className="notification-title">{notification.title}</h3>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-date">
                        {formatDate(notification.date)}
                      </span>
                      {notification.auction_id && (
                        <Link 
                          to={`/auction/${notification.auction_id}`}
                          className="notification-action"
                        >
                          View Auction
                        </Link>
                      )}
                    </div>
                    
                    <button 
                      className="notification-delete"
                      onClick={() => deleteNotification(notification.id)}
                      aria-label="Delete notification"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-sidebar">
            <div className="sidebar-user">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">{getInitials(user.name)}</div>
                )}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'my-bids' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-bids')}
              >
                <Gavel size={20} />
                <span>My Bids</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'watching' ? 'active' : ''}`}
                onClick={() => setActiveTab('watching')}
              >
                <Heart size={20} />
                <span>Watchlist</span>
                <span className="item-count">{watchlist.length}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'won' ? 'active' : ''}`}
                onClick={() => setActiveTab('won')}
              >
                <Star size={20} />
                <span>Won Auctions</span>
                <span className="item-count">{wonAuctions.length}</span>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={20} />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="notification-badge">{unreadNotificationCount}</span>
                )}
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Profile Settings</span>
              </button>
            </nav>
            
            <div className="sidebar-footer">
              <Link to="/logout" className="logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
              </Link>
            </div>
          </div>
          
          <div className="dashboard-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
