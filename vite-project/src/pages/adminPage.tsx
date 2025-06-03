import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAuctions, updateAuctionStatus } from '../services/auctionService';
import { useAuth } from '../context/AuthContext';
import type { Auction } from '../types/types';
import '../styles/adminPage.css';

const AdminPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/profile');
      return;
    }

    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const data = await getAllAuctions();
        setAuctions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load auctions');
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [user, navigate]);
  const handleStatusChange = async (auctionId: string, newStatus: 'active' | 'closed' | 'pending') => {
    try {
      setStatusUpdating(auctionId);
      await updateAuctionStatus(auctionId, newStatus);
      
      // Update local state after successful API call
      setAuctions(prevAuctions => 
        prevAuctions.map(auction => 
          auction.auction_id === auctionId 
            ? { ...auction, status: newStatus === 'active' ? 'OPEN' : newStatus } 
            : auction
        )
      );

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'status-notification success';
      notification.textContent = `Auction status updated successfully to ${newStatus}!`;
      document.body.appendChild(notification);

      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);

    } catch (err: any) {
      setError(`Failed to update auction status: ${err.message}`);
      console.error('Error updating auction status:', err);

      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'status-notification error';
      notification.textContent = `Failed to update status: ${err.message || 'Unknown error'}`;
      document.body.appendChild(notification);

      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } finally {
      setStatusUpdating(null);
    }
  };

  const filteredAuctions = auctions
    .filter(auction => {
      // Filter by status
      if (filterStatus !== 'all') {
        const status = filterStatus === 'OPEN' ? 'OPEN' : 
                      filterStatus === 'closed' ? 'closed' : 'pending';
        return auction.status === status;
      }
      return true;
    })
    .filter(auction => {
      // Filter by search term
      if (searchTerm.trim() === '') return true;
      
      const term = searchTerm.toLowerCase();
      return (
        auction.title.toLowerCase().includes(term) || 
        auction.description.toLowerCase().includes(term) ||
        auction.auction_id.toLowerCase().includes(term) ||
        (auction.vehicle?.brand && auction.vehicle.brand.toLowerCase().includes(term)) ||
        (auction.vehicle?.model && auction.vehicle.model.toLowerCase().includes(term))
      );
    });

  if (loading) {
    return (
      <div className="admin-page loading">
        <div className="loading-spinner"></div>
        <h2>Loading auctions...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Auction Management</h1>
        <div className="admin-actions">
          <button 
            onClick={() => navigate('/create-auction')} 
            className="create-btn"
          >
            Create New Auction
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className="back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="auction-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">Active (Open)</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="search-group">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredAuctions.length === 0 ? (
        <div className="no-auctions">
          <p>No auctions found matching your criteria.</p>
        </div>
      ) : (
        <div className="auction-table-container">
          <table className="auction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Current Price</th>
                <th>Status</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.map(auction => (
                <tr key={auction.auction_id}>
                  <td>{auction.auction_id}</td>
                  <td>
                    <div className="auction-title-cell">
                      {auction.image && (
                        <div className="auction-thumbnail">
                          <img 
                            src={`http://localhost:3000/uploads/${auction.image}`} 
                            alt={auction.title}
                            onError={(e) => {
                              // (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                            }}
                          />
                        </div>
                      )}
                      <div className="auction-details">
                        <h4>{auction.title}</h4>
                        <p className="auction-category">{auction.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="price-cell">${auction.currentPrice.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${auction.status.toLowerCase()}`}>
                      {auction.status}
                    </span>
                  </td>
                  <td>
                    {new Date(auction.endDate).toLocaleDateString()} 
                    <br />
                    <span className="time-text">
                      {new Date(auction.endDate).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => navigate(`/auction/${auction.auction_id}`)}
                      className="view-btn"
                    >
                      View
                    </button>
                    <div className="status-buttons">                      <button
                        onClick={() => handleStatusChange(auction.auction_id, 'active')}
                        className={`status-btn active-btn ${auction.status === 'OPEN' ? 'disabled' : ''}`}
                        disabled={auction.status === 'OPEN' || statusUpdating === auction.auction_id}
                      >
                        {statusUpdating === auction.auction_id ? 'Updating...' : 'Set Active'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(auction.auction_id, 'closed')}
                        className={`status-btn close-btn ${auction.status === 'closed' ? 'disabled' : ''}`}
                        disabled={auction.status === 'closed' || statusUpdating === auction.auction_id}
                      >
                        {statusUpdating === auction.auction_id ? 'Updating...' : 'Close Auction'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;