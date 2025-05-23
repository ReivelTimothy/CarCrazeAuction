import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Clock, Users, Gavel, Heart, Share2, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/navbar';
import CountdownTimer from '../components/CountdownTimer';
import { auctionsAPI, bidsAPI } from "../services/apiService";
import '../styles/auction-detail.css';

interface Auction {
    auction_id: string;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    startDate: string;
    endDate: string;
    status: string;
    category: string;
    image: string;
    vehicle: {
        vehicle_id: string;
        type: string;
        brand: string;
        model: string;
        year: number;
        color: string;
        mileage: number;
        transmissionType: string;
        fuelType: string;
        condition: string;
        documents: string;
    };
}

interface Bid {
    bid_id: string;
    user_id: string;
    amount: number;
    bidTime: string;
    user: {
        username: string;
    };
}

const AuctionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [placingBid, setPlacingBid] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');    const fetchAuctionDetails = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            
            // Fetch auction details using the auctionsAPI service
            const auctionResponse = await auctionsAPI.getById(id);
            setAuction(auctionResponse.data);
            
            // Fetch highest bid using the bidsAPI service
            try {
                const bidResponse = await bidsAPI.getHighestBid(id);
                if (bidResponse.data) {
                    setBids([bidResponse.data]);
                }
            } catch (bidError) {
                // No bids yet
                setBids([]);
            }
            
        } catch (error) {
            console.error("Error fetching auction details:", error);
            setError("Failed to load auction details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchAuctionDetails();
        }
    }, [id]);    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };
    
    // Note: formatTimeRemaining is kept for compatibility but no longer used in the UI
    // The CountdownTimer component is used instead
    const formatTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Auction Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };    const handlePlaceBid = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auction || !bidAmount) return;
        
        const bidValue = parseFloat(bidAmount);
        if (bidValue <= auction.currentPrice) {
            setError('Bid must be higher than current price');
            return;
        }

        try {
            setPlacingBid(true);
            setError('');
            
            // Use the bidsAPI service to place a bid
            await bidsAPI.updateBidPrice(auction.auction_id, {
                amount: bidValue
            });
            
            setSuccess('Bid placed successfully!');
            setBidAmount('');
            
            // Refresh auction data
            const auctionResponse = await auctionsAPI.getById(id!);
            setAuction(auctionResponse.data);
            
            // Get updated highest bid
            const bidResponse = await bidsAPI.getHighestBid(id!);
            if (bidResponse.data) {
                setBids([bidResponse.data]);
            }
            
        } catch (error) {
            console.error("Error placing bid:", error);
            setError("Failed to place bid. Please try again.");
        } finally {
            setPlacingBid(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="main-content">
                    <div className="auction-detail-container">
                        <div className="loading-auction-detail">
                            <div className="loading-image-large"></div>
                            <div className="loading-content-detail">
                                <div className="loading-line" style={{ height: '2rem', marginBottom: '1rem' }}></div>
                                <div className="loading-line" style={{ width: '60%', marginBottom: '2rem' }}></div>
                                <div className="loading-line" style={{ height: '3rem', marginBottom: '1rem' }}></div>
                                <div className="loading-line" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!auction) {
        return (
            <>
                <Navbar />
                <div className="main-content">
                    <div className="error-container">
                        <AlertCircle size={48} />
                        <h2>Auction Not Found</h2>
                        <p>The auction you're looking for doesn't exist or has been removed.</p>
                        <button onClick={() => navigate('/auctions')} className="back-btn">
                            Back to Auctions
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="main-content">
                <div className="auction-detail-container">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="back-button"
                    >
                        ← Back
                    </button>

                    <div className="auction-detail-grid">
                        {/* Left Column - Image and Gallery */}
                        <div className="auction-image-section">
                            <div className="auction-main-image">
                                <Car size={80} className="image-placeholder" />
                                <div className="auction-status-badge">
                                    {auction.status}
                                </div>
                            </div>
                            
                            <div className="auction-actions-bar">
                                <button className="action-btn">
                                    <Heart size={20} />
                                    Save
                                </button>
                                <button className="action-btn">
                                    <Share2 size={20} />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Details and Bidding */}
                        <div className="auction-info-section">
                            <div className="auction-header">
                                <h1 className="auction-title">{auction.title}</h1>
                                <div className="auction-meta">
                                    <span className="auction-category">{auction.category}</span>
                                    <span className="auction-year">{auction.vehicle.year}</span>
                                </div>
                            </div>                            {/* Timer */}
                            <div className="auction-timer-card">
                                <Clock size={24} />
                                <div className="timer-content">
                                    <div className="timer-label">Time Remaining</div>
                                    <CountdownTimer 
                                        endDate={auction.endDate}
                                        size="lg"
                                        onExpire={() => {
                                            // Refresh auction details to update status
                                            fetchAuctionDetails();
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Current Price */}
                            <div className="price-section">
                                <div className="current-price">
                                    <div className="price-label">Current Bid</div>
                                    <div className="price-value">{formatPrice(auction.currentPrice)}</div>
                                </div>
                                <div className="starting-price">
                                    <div className="price-label">Starting Price</div>
                                    <div className="price-value-small">{formatPrice(auction.startingPrice)}</div>
                                </div>
                            </div>

                            {/* Bid Form */}
                            {auction.status.toLowerCase() === 'open' && (
                                <form onSubmit={handlePlaceBid} className="bid-form">
                                    <div className="bid-input-group">
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={`Min: ${formatPrice(auction.currentPrice + 100000)}`}
                                            className="bid-input"
                                            min={auction.currentPrice + 1}
                                            step="100000"
                                        />
                                        <button 
                                            type="submit" 
                                            className="bid-button"
                                            disabled={placingBid}
                                        >
                                            {placingBid ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    Placing Bid...
                                                </>
                                            ) : (
                                                <>
                                                    <Gavel size={20} />
                                                    Place Bid
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Messages */}
                            {error && (
                                <div className="message error-message">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                            
                            {success && (
                                <div className="message success-message">
                                    <CheckCircle size={16} />
                                    {success}
                                </div>
                            )}

                            {/* Vehicle Details */}
                            <div className="vehicle-details">
                                <h3>Vehicle Details</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Brand</span>
                                        <span className="detail-value">{auction.vehicle.brand}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Model</span>
                                        <span className="detail-value">{auction.vehicle.model}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Year</span>
                                        <span className="detail-value">{auction.vehicle.year}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Color</span>
                                        <span className="detail-value">{auction.vehicle.color}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Mileage</span>
                                        <span className="detail-value">{auction.vehicle.mileage.toLocaleString()} km</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Transmission</span>
                                        <span className="detail-value">{auction.vehicle.transmissionType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Fuel Type</span>
                                        <span className="detail-value">{auction.vehicle.fuelType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Condition</span>
                                        <span className="detail-value">{auction.vehicle.condition}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="auction-description">
                                <h3>Description</h3>
                                <p>{auction.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bidding History */}
                    <div className="bidding-history">
                        <h3>
                            <Users size={20} />
                            Bidding History
                        </h3>
                        {bids.length > 0 ? (
                            <div className="bids-list">
                                {bids.map((bid) => (
                                    <div key={bid.bid_id} className="bid-item">
                                        <div className="bid-user">
                                            <div className="user-avatar">
                                                {bid.user?.username?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <div className="user-name">{bid.user?.username || 'Anonymous'}</div>
                                                <div className="bid-time">
                                                    {new Date(bid.bidTime).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bid-amount">
                                            {formatPrice(bid.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-bids">
                                <p>No bids yet. Be the first to bid!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuctionDetail;
