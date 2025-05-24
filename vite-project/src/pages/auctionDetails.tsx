import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuctionById } from '../services/auctionService';
import { getVehicleById } from '../services/vehicleService';
import { getHighestBid, placeBid } from '../services/bidService';
import { useAuth } from '../context/AuthContext';
import type { Auction, Vehicle, Bid } from '../types/types';
import '../styles/auctionDetails.css';

const AuctionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [highestBid, setHighestBid] = useState<Bid | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch auction details
        const auctionData = await getAuctionById(id);
        setAuction(auctionData);
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
        setTimeLeft(calculateTimeLeft(auction.endDate));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id]);
  
  useEffect(() => {
    if (auction) {
      setTimeLeft(calculateTimeLeft(auction.endDate));
      // Set initial bid amount suggestion
      const suggestedBid = auction.currentPrice + (auction.currentPrice * 0.05);
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

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auction || !user) return;
    
    const bidAmountNum = parseFloat(bidAmount);
    
    // Validation
    if (isNaN(bidAmountNum)) {
      setBidError('Please enter a valid bid amount.');
      return;
    }
    
    if (bidAmountNum <= auction.currentPrice) {
      setBidError(`Bid amount must be higher than current price: $${auction.currentPrice}`);
      return;
    }
    
    if (calculateTimeLeft(auction.endDate) === "Auction ended") {
      setBidError('This auction has ended.');
      return;
    }
    
    try {
      setBidError(null);
      setLoading(true);
      
      await placeBid(id!, bidAmountNum);
      
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
        // This shouldn't happen since we just placed a bid
      }
      
      setBidSuccess('Your bid has been placed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setBidSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error placing bid:', err);
      setBidError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const isAuctionActive = auction.status === 'active' && calculateTimeLeft(auction.endDate) !== "Auction ended";

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
      
      <div className="auction-details-content">
        <div className="auction-main-info">
          <div className="auction-image-gallery">
            {auction.image ? (
              <img src={auction.image} alt={auction.title} />
            ) : (
              <div className="placeholder-image">
                <span>{vehicle?.brand || 'Vehicle'}</span>
              </div>
            )}
          </div>
          
          <div className="auction-info">
            <h1>{auction.title}</h1>
            <div className="auction-meta-details">
              <div className="meta-item">
                <span className="meta-label">Current Bid:</span>
                <span className="meta-value price">${auction.currentPrice.toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Time Left:</span>
                <span className="meta-value time-left">{timeLeft}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Ending:</span>
                <span className="meta-value">{formatDate(auction.endDate)}</span>
              </div>
            </div>
            
            {isAuctionActive && (
              <div className="bid-section">
                {bidError && <div className="bid-error">{bidError}</div>}
                {bidSuccess && <div className="bid-success">{bidSuccess}</div>}
                <form onSubmit={handleBidSubmit} className="bid-form">
                  <div className="bid-input-group">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={auction.currentPrice + 1}
                      step="any"
                      required
                      className="bid-input"
                      disabled={!isAuctionActive}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bid-button"
                    disabled={!isAuctionActive || loading}
                  >
                    {loading ? 'Processing...' : 'Place Bid'}
                  </button>
                </form>
                <p className="bid-suggestion">
                  Suggested bid: ${(auction.currentPrice * 1.05).toFixed(2)}
                </p>
              </div>
            )}
            
            {!isAuctionActive && auction.status === 'active' && (
              <div className="auction-ended">
                <p>This auction has ended.</p>
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