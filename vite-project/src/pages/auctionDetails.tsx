import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuctionById, updateAuctionStatus, checkAuctionEndAndDetermineWinner } from '../services/auctionService';
import { getVehicleById } from '../services/vehicleService';
import { getHighestBid, placeBid } from '../services/bidService';
import { checkUserIsWinnerAndGetTransaction } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import type { Auction, Vehicle, Bid } from '../types/types';
import '../styles/auctionDetails.css';

const AuctionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();  const [auction, setAuction] = useState<Auction | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [highestBid, setHighestBid] = useState<Bid | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);  const [statusUpdateLoading, setStatusUpdateLoading] = useState<boolean>(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);  const [isAuctionClosed, setIsAuctionClosed] = useState<boolean>(false);
  const [isUserWinner, setIsUserWinner] = useState<boolean>(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkAuctionStatusAndWinner = async () => {
    if (!id || !user) return;
    
    try {
      // Check if auction has ended
      const auctionEndCheck = await checkAuctionEndAndDetermineWinner(id);
      
      if (auctionEndCheck.status === 'closed' || auctionEndCheck.message.includes('closed')) {
        setIsAuctionClosed(true);
        
        // Check if current user is the winner
        const winnerCheck = await checkUserIsWinnerAndGetTransaction(id);
          setIsUserWinner(winnerCheck.isWinner);
        
        if (winnerCheck.isWinner && winnerCheck.transaction) {
          setTransactionDetails(winnerCheck.transaction);
        }
      }
    } catch (err) {
      console.error('Error checking auction winner status:', err);
    }
  };

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!id) return;
      console.log("Fetching auction details for ID:", id);
      console.log("User in auction details:", user?.user_id);
      try {
        setLoading(true);
        setError(null);
        
        // Fetch auction details
        const auctionData = await getAuctionById(id);
        setAuction(auctionData);
        console.log("auction id : "+auctionData.auction_id);
        
        // Check if auction is closed
        if (auctionData.status === 'closed') {
          setIsAuctionClosed(true);
        }
        
        // Fetch vehicle details
        const vehicleData = await getVehicleById(auctionData.vehicle_id);
        setVehicle(vehicleData);
        
        // Fetch highest bid - in a separate try/catch to avoid preventing rest of data from loading
        try {
          const bidData = await getHighestBid(id);
          if (bidData) {
            setHighestBid(bidData);
          }
        } catch (bidErr) {
          // It's normal to have no bids, so just log it with more context
          console.log('No bids found for this auction - handled gracefully');
          // highestBid remains null which is fine
        }
        
        // Check if user is winner if auction is closed or ending soon
        if (auctionData.status === 'closed' || new Date(auctionData.endDate) <= new Date()) {
          await checkAuctionStatusAndWinner();
        }
      } catch (err: any) {
        console.error('Error fetching auction details:', err);
        setError('Failed to load auction details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctionDetails();
    
    // Set up timer for countdown
    const timer = setInterval(() => {
      if (auction) {
        const timeLeftStr = calculateTimeLeft(auction.endDate);
        setTimeLeft(timeLeftStr);
        
        // If auction just ended, check for winner
        if (timeLeftStr === "Auction ended" && !isAuctionClosed) {
          checkAuctionStatusAndWinner();
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id, user]);
    useEffect(() => {
    if (auction) {
      setTimeLeft(calculateTimeLeft(auction.endDate));
      // Set initial bid amount suggestion to minimum bid
      const suggestedBid = calculateMinimumBid();
      setBidAmount(suggestedBid.toString());
    }
  }, [auction]);

  const calculateTimeLeft = (endDate: string | Date): string => {
    const difference = new Date(endDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return "Auction ended";
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to calculate minimum bid amount based on backend logic
  const calculateMinimumBid = (): number => {
    if (!auction) return 0;
    // Backend logic: 5% of current price or at least 1,000,000, whichever is greater
    const minIncrement = Math.max(auction.currentPrice * 0.05, 1000000);
    return auction.currentPrice + minIncrement;
  };

  // Helper to get smart quick bid amounts
  const getQuickBidAmounts = (): number[] => {
    if (!auction) return [200000, 500000, 1000000];
    
    const minBid = calculateMinimumBid();
    const currentPrice = auction.currentPrice;
    
    // Generate smart increments that make sense for the current price
    const baseIncrement = Math.max(auction.currentPrice * 0.05, 1000000);
    
    return [
      minBid, // Minimum allowed bid
      currentPrice + baseIncrement * 2, // 2x minimum increment
      currentPrice + baseIncrement * 5, // 5x minimum increment
    ];
  };

  // Helper to format currency for display
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString();
  };
  // Modified handleBidSubmit to accept optional amount
  const handleBidSubmit = async (e: React.FormEvent | null, customAmount?: number) => {
    if (e) e.preventDefault();
    const amountToBid = customAmount !== undefined ? customAmount : parseFloat(bidAmount);
    if (!auction || !user) return;
    
    // Prevent admins from placing bids
    if (user.role === 'admin') {
      setBidError('Admins are not allowed to place bids');
      return;
    }
    
    // Check if auction is closed 
    if (auction.status === 'closed') {
      setBidError('This auction is closed.');
      return;
    }
    
    // Check if auction time has ended
    if (calculateTimeLeft(auction.endDate) === "Auction ended") {
      await checkAuctionStatusAndWinner();
      setBidError('This auction has ended.');
      return;
    }

    // Validate minimum bid amount
    const minBid = calculateMinimumBid();
    if (amountToBid < minBid) {
      setBidError(`Your bid must be at least $${minBid.toLocaleString()}`);
      return;
    }

    // Clear any previous errors
    setBidError(null);
    
    console.log(`Bid placed: ${amountToBid} for auction ${auction.auction_id}`);
    try {
      setLoading(true);
      await placeBid(auction.auction_id, amountToBid, user.user_id);
      
      // Update auction with new bid price
      const updatedAuction = await getAuctionById(id!);
      setAuction(updatedAuction);
      
      // Get new highest bid
      try {
        const newHighestBid = await getHighestBid(id!);
        if (newHighestBid) {
          setHighestBid(newHighestBid);
        }
      } catch (bidErr) {
        console.log('Failed to get updated bid information');
      }
      
      setBidSuccess('Your bid has been placed successfully!');
      setBidAmount(''); // Clear the input
      setTimeout(() => setBidSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error placing bid:', err);
      setBidError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Admin status update handler
  const handleStatusUpdate = async (newStatus: 'active' | 'closed' | 'pending') => {
    if (!auction || !user || user.role !== 'admin') return;
    
    setStatusUpdateLoading(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);
    
    try {
      await updateAuctionStatus(auction.auction_id, newStatus);
      // Update local state with proper mapping
      const statusMapping = {
        'active': 'OPEN' as const,
        'closed': 'closed' as const,
        'pending': 'pending' as const
      };
      setAuction(prev => prev ? { ...prev, status: statusMapping[newStatus] } : null);
      setStatusUpdateSuccess(`Auction status updated to ${newStatus}`);
      setTimeout(() => setStatusUpdateSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating auction status:', err);
      setStatusUpdateError(err.message || 'Failed to update auction status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };  // Helper to increase bid and submit
  const handleQuickBid = async (bidAmount: number) => {
    if (!auction || !user) return;
    
    // Prevent admins from placing quick bids
    if (user.role === 'admin') {
      setBidError('Admins are not allowed to place bids');
      return;
    }
    
    const minBid = calculateMinimumBid();
    if (bidAmount < minBid) {
      setBidError(`Minimum bid is $${minBid.toLocaleString()}`);
      return;
    }
    
    setBidAmount(bidAmount.toString());
    console.log("Quick bid amount: ", bidAmount);
    handleBidSubmit(null, bidAmount);
  };

  if (loading && !auction) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading auction details...</p>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="auction-error">
        <h2>Error</h2>
        <p>{error || 'Could not find the requested auction.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>
          Return to Home
        </button>
      </div>
    );
  }

  const isAuctionActive = auction.status === 'OPEN' && calculateTimeLeft(auction.endDate) !== "Auction ended";

  return (
    <div className="auction-details-container">
      <div className="auction-details-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          &larr; Back to Auctions
        </button>
        <div className="auction-status-tag">
          <span className={`status-indicator ${auction.status}`}></span>
          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
        </div>
      </div>
      
      {/* Admin Controls Panel */}
      {user && user.role === 'admin' && (
        <div className="admin-panel">
          <h3>Admin Controls</h3>
          {statusUpdateError && <div className="status-update-error">{statusUpdateError}</div>}
          {statusUpdateSuccess && <div className="status-update-success">{statusUpdateSuccess}</div>}
          <div className="admin-controls">
            <button
              className="admin-btn admin-btn-open"
              onClick={() => handleStatusUpdate('active')}
              disabled={auction.status === 'OPEN' || statusUpdateLoading}
            >
              {statusUpdateLoading ? 'Updating...' : 'Set Active'}
            </button>
            <button
              className="admin-btn admin-btn-close"
              onClick={() => handleStatusUpdate('closed')}
              disabled={auction.status === 'closed' || statusUpdateLoading}
            >
              {statusUpdateLoading ? 'Updating...' : 'Close Auction'}
            </button>
            <button
              className="admin-btn admin-btn-pending"
              onClick={() => handleStatusUpdate('pending')}
              disabled={auction.status === 'pending' || statusUpdateLoading}
            >
              {statusUpdateLoading ? 'Updating...' : 'Set Pending'}
            </button>
          </div>
        </div>
      )}
      
      <div className="auction-details-content">
        <div className="auction-main-info">
          <div className="auction-image-gallery">
            {auction.image ? (
              <img src={`http://localhost:3000/uploads/${auction.image}`} alt={auction.title} />
            ) : (
              <div className="placeholder-image">
                <span>{vehicle?.brand || 'Vehicle'}</span>
              </div>
            )}
          </div>
          
          <div className="auction-info">
            <h1>{auction.title}</h1>            <div className="auction-meta-details">
              <div className="meta-item">
                <span className="meta-label">Current Bid:</span>
                <span className="meta-value price">$  {auction.currentPrice.toLocaleString()}</span>
              </div>              {highestBid && (
                <div className="meta-item">
                  <span className="meta-label">Highest Bidder:</span>
                  <span className="meta-value">{highestBid.user?.username || `User ${highestBid.user_id}`}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Time Left:</span>
                <span className="meta-value time-left">{timeLeft}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Ending:</span>
                <span className="meta-value">{formatDate(auction.endDate)}</span>
              </div>            </div>            {/* Only show bid section for non-admin users */}
            {isAuctionActive && user && user.role !== 'admin' && (
              <div className="bid-section">
                {bidError && <div className="bid-error">{bidError}</div>}
                {bidSuccess && <div className="bid-success">{bidSuccess}</div>}
                
                {/* Manual Bid Form */}
                <form onSubmit={handleBidSubmit} className="bid-form">
                  <div className="bid-input-container">
                    <div className="bid-input-group">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min: ${calculateMinimumBid().toLocaleString()}`}
                        min={calculateMinimumBid()}
                        step="1000"
                        className="bid-input"
                        disabled={!isAuctionActive || loading}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bid-button bid-submit"
                      disabled={!isAuctionActive || loading || !bidAmount || parseFloat(bidAmount) < calculateMinimumBid()}
                    >
                      {loading ? 'Placing...' : 'Place Bid'}
                    </button>
                  </div>
                </form>

                {/* Quick Bid Buttons */}
                <div className="quick-bid-section">
                  <p className="quick-bid-label">Quick Bid Options:</p>
                  <div className="bid-buttons-group">
                    {getQuickBidAmounts().map((amount, index) => (
                      <button
                        key={index}
                        type="button"
                        className="bid-button quick-bid-button"
                        disabled={!isAuctionActive || loading}
                        onClick={() => handleQuickBid(amount)}
                      >
                        +{formatCurrency(amount - auction.currentPrice)} 
                        <span className="bid-total">(${formatCurrency(amount)})</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <p className="bid-suggestion">
                  Minimum bid: ${calculateMinimumBid().toLocaleString()}
                </p>
              </div>
            )}
              {isAuctionActive && !user && (
              <div className="login-to-bid">
                <p>Please login to place bids on this auction.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login to Bid
                </button>
              </div>
            )}
            
            {/* Show message for admin users explaining why they can't bid */}
            {isAuctionActive && user && user.role === 'admin' && (
              <div className="admin-bid-message">
                <p>As an admin, you cannot place bids on auctions.</p>
              </div>            )}
            
            {(auction.status === 'closed' || timeLeft === "Auction ended") && (
              <div className="auction-ended">
                <p className="auction-closed-message">This auction has ended.</p>
                
                {isUserWinner && (
                  <div className="winner-section">
                    <p className="winner-message">Congratulations! You are the winner of this auction!</p>
                    {transactionDetails && (
                      <div className="transaction-details">
                        <p>Your winning bid: ${transactionDetails.amount.toLocaleString()}</p>
                        <p>Transaction status: {transactionDetails.status}</p>
                        <button 
                          className="btn btn-success" 
                          onClick={() => navigate(`/transaction/${transactionDetails.transaction_id}`)}
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    )}
                    {!transactionDetails && (
                      <button 
                        className="btn btn-primary" 
                        onClick={checkAuctionStatusAndWinner}
                      >
                        View Transaction Details
                      </button>
                    )}
                  </div>
                )}
                
                {user && !isUserWinner && (
                  <p className="not-winner-message">You did not win this auction.</p>
                )}
                
                {!user && (
                  <p>Sign in to see if you're the winner.</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="auction-details-tabs">
          <div className="tabs-content">
            <div className="tab-section">
              <h2>Description</h2>
              <div className="description-content">
                <p>{auction.description}</p>
              </div>
            </div>
            
            {vehicle && (
              <div className="tab-section">
                <h2>Vehicle Details</h2>
                <div className="vehicle-specs">
                  <div className="spec-group">
                    <div className="spec-item">
                      <span className="spec-label">Brand:</span>
                      <span className="spec-value">{vehicle.brand}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Model:</span>
                      <span className="spec-value">{vehicle.model}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Year:</span>
                      <span className="spec-value">{vehicle.year}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Type:</span>
                      <span className="spec-value">{vehicle.type}</span>
                    </div>
                  </div>
                  
                  <div className="spec-group">
                    <div className="spec-item">
                      <span className="spec-label">Color:</span>
                      <span className="spec-value">{vehicle.color}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Mileage:</span>
                      <span className="spec-value">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Transmission:</span>
                      <span className="spec-value">{vehicle.transmissionType}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Fuel Type:</span>
                      <span className="spec-value">{vehicle.fuelType}</span>
                    </div>
                  </div>
                  
                  <div className="spec-group">
                    <div className="spec-item">
                      <span className="spec-label">Condition:</span>
                      <span className="spec-value">{vehicle.condition}</span>
                    </div>
                    <div className="spec-item full-width">
                      <span className="spec-label">Documents:</span>
                      <span className="spec-value">{vehicle.documents}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;