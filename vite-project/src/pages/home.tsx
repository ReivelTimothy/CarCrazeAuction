import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Eye, Gavel, ArrowRight, Clock } from 'lucide-react';
import Navbar from '../components/navbar';
import CountdownTimer from '../components/CountdownTimer';
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import '../styles/home.css';

interface UserProfile {
    user_id: string;
    username: string;
    email: string;
}

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
        brand: string;
        model: string;
        year: number;
        color: string;
    };
}

const Home: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch user profile
                const userData = await fetchFromAPI("/user/getUserProfile", "GET");
                setUser(userData);
                
                // Fetch auctions
                const auctionsData = await fetchFromAPI("/auction/getAllAuctions", "GET");
                setAuctions(auctionsData);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open': return 'live';
            case 'upcoming': return 'upcoming';
            case 'closed': return 'ended';
            default: return 'live';
        }
    };

    const categories = [
        { name: 'Luxury Cars', icon: '🏎️', count: 45 },
        { name: 'SUVs', icon: '🚙', count: 32 },
        { name: 'Sports Cars', icon: '🏁', count: 28 },
        { name: 'Classic Cars', icon: '🚗', count: 15 },
        { name: 'Motorcycles', icon: '🏍️', count: 22 },
        { name: 'Trucks', icon: '🚛', count: 18 },
    ];

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="main-content">
                    {/* Hero Section Loading */}
                    <section className="hero-section">
                        <div className="hero-background"></div>
                        <div className="hero-content">
                            <div className="loading-line" style={{ width: '300px', height: '3rem', margin: '0 auto 1rem' }}></div>
                            <div className="loading-line" style={{ width: '500px', height: '1.5rem', margin: '0 auto 2rem' }}></div>
                            <div className="hero-stats">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="hero-stat">
                                        <div className="loading-line" style={{ width: '80px', height: '2rem', margin: '0 auto 0.5rem' }}></div>
                                        <div className="loading-line" style={{ width: '100px', height: '1rem', margin: '0 auto' }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Auctions Loading */}
                    <section className="featured-section">
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="loading-card">
                                    <div className="loading-image"></div>
                                    <div className="loading-content">
                                        <div className="loading-line"></div>
                                        <div className="loading-line short"></div>
                                        <div className="loading-line medium"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-background"></div>
                    <div className="hero-content">
                        <h1 className="hero-title animate-slide-in-up">
                            Welcome to <span className="hero-title-accent">CarCraze</span>
                        </h1>
                        <p className="hero-subtitle animate-slide-in-up">
                            The ultimate destination for premium car auctions. Discover, bid, and win your dream vehicle 
                            in our exclusive online marketplace.
                        </p>
                        
                        <div className="hero-stats animate-slide-in-up">
                            <div className="hero-stat">
                                <span className="hero-stat-number">{auctions.length}</span>
                                <span className="hero-stat-label">Live Auctions</span>
                            </div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">1,200+</span>
                                <span className="hero-stat-label">Vehicles Sold</span>
                            </div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">850+</span>
                                <span className="hero-stat-label">Happy Bidders</span>
                            </div>
                        </div>

                        <div className="hero-actions animate-slide-in-up">
                            <button 
                                onClick={() => navigate('/auctions')}
                                className="hero-btn hero-btn-primary"
                            >
                                <Gavel size={20} />
                                Start Bidding
                            </button>
                            <button 
                                onClick={() => navigate('/vehicles')}
                                className="hero-btn hero-btn-secondary"
                            >
                                <Car size={20} />
                                Browse Vehicles
                            </button>
                        </div>
                    </div>
                </section>

                {/* Featured Auctions */}
                <section className="featured-section">
                    <div className="section-header">
                        <h2 className="section-title">Featured Auctions</h2>
                        <p className="section-subtitle">
                            Don't miss out on these premium vehicles currently available for bidding
                        </p>
                    </div>

                    {error && (
                        <div style={{ 
                            textAlign: 'center', 
                            color: 'var(--accent-danger)', 
                            marginBottom: '2rem',
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="auctions-grid">
                        {auctions.slice(0, 6).map((auction) => (
                            <div key={auction.auction_id} className="auction-card animate-fade-in">
                                <div className="auction-image">
                                    <Car size={60} className="auction-image-placeholder" />
                                    <div className={`auction-status ${getStatusColor(auction.status)}`}>
                                        {auction.status}
                                    </div>                                    <div className="auction-timer">
                                        <Clock size={16} style={{ marginRight: '0.5rem' }} />
                                        <CountdownTimer 
                                            endDate={auction.endDate}
                                            size="sm" 
                                            showLabels={false}
                                        />
                                    </div>
                                </div>
                                
                                <div className="auction-content">
                                    <h3 className="auction-title">{auction.title}</h3>
                                    
                                    <div className="auction-details">
                                        <span className="auction-category">{auction.category}</span>
                                        <span className="auction-year">
                                            {auction.vehicle?.year || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="auction-price">
                                        <div>
                                            <div className="price-label">Current Bid</div>
                                            <div className="price-value">
                                                {formatPrice(auction.currentPrice)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="price-label">Starting Price</div>
                                            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                                {formatPrice(auction.startingPrice)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="auction-actions">
                                        <button 
                                            onClick={() => navigate(`/auction/${auction.auction_id}`)}
                                            className="auction-btn auction-btn-primary"
                                        >
                                            <Gavel size={16} />
                                            Place Bid
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/auction/${auction.auction_id}`)}
                                            className="auction-btn auction-btn-secondary"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {auctions.length > 6 && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button 
                                onClick={() => navigate('/auctions')}
                                className="hero-btn hero-btn-primary"
                            >
                                View All Auctions
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </section>

                {/* Categories */}
                <section className="categories-section">
                    <div className="section-header">
                        <h2 className="section-title">Browse by Category</h2>
                        <p className="section-subtitle">
                            Find the perfect vehicle type that matches your preferences
                        </p>
                    </div>

                    <div className="categories-grid">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => navigate(`/vehicles?category=${category.name.toLowerCase()}`)}
                                className="category-card"
                            >
                                <div className="category-icon">
                                    {category.icon}
                                </div>
                                <div className="category-name">{category.name}</div>
                                <div className="category-count">{category.count} vehicles</div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
