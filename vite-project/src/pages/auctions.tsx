import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SortAsc, SortDesc, Clock, Gavel, Eye, Heart } from 'lucide-react';
import Navbar from '../components/navbar';
import CountdownTimer from '../components/CountdownTimer';
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import '../styles/auctions.css';

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
        mileage: number;
    };
    bidCount: number;
}

const Auctions: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'ending-soon');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'luxury', label: 'Luxury Cars' },
        { value: 'sports', label: 'Sports Cars' },
        { value: 'classic', label: 'Classic Cars' },
        { value: 'suv', label: 'SUVs' },
        { value: 'electric', label: 'Electric Cars' },
        { value: 'motorcycle', label: 'Motorcycles' }
    ];

    const sortOptions = [
        { value: 'ending-soon', label: 'Ending Soon' },
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'most-bids', label: 'Most Bids' }
    ];

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await fetchFromAPI('auctions', 'GET');
                
                // Mock data for demonstration
                const mockAuctions: Auction[] = [
                    {
                        auction_id: '1',
                        title: '2023 Ferrari 488 GTB',
                        description: 'Pristine condition Ferrari with low mileage',
                        startingPrice: 200000,
                        currentPrice: 285000,
                        startDate: '2025-05-20T10:00:00Z',
                        endDate: '2025-05-25T18:00:00Z',
                        status: 'live',
                        category: 'sports',
                        image: '/api/placeholder/800/600',
                        vehicle: {
                            brand: 'Ferrari',
                            model: '488 GTB',
                            year: 2023,
                            mileage: 5000
                        },
                        bidCount: 24
                    },
                    {
                        auction_id: '2',
                        title: '1967 Ford Mustang Fastback',
                        description: 'Fully restored classic muscle car',
                        startingPrice: 45000,
                        currentPrice: 67500,
                        startDate: '2025-05-21T09:00:00Z',
                        endDate: '2025-05-26T20:00:00Z',
                        status: 'live',
                        category: 'classic',
                        image: '/api/placeholder/800/600',
                        vehicle: {
                            brand: 'Ford',
                            model: 'Mustang Fastback',
                            year: 1967,
                            mileage: 45000
                        },
                        bidCount: 18
                    },
                    {
                        auction_id: '3',
                        title: '2024 Tesla Model S Plaid',
                        description: 'Latest Tesla technology with autopilot',
                        startingPrice: 100000,
                        currentPrice: 120000,
                        startDate: '2025-05-22T12:00:00Z',
                        endDate: '2025-05-27T15:00:00Z',
                        status: 'live',
                        category: 'electric',
                        image: '/api/placeholder/800/600',
                        vehicle: {
                            brand: 'Tesla',
                            model: 'Model S Plaid',
                            year: 2024,
                            mileage: 1000
                        },
                        bidCount: 31
                    },
                    {
                        auction_id: '4',
                        title: '2023 Porsche 911 Turbo S',
                        description: 'Track-ready Porsche with sport package',
                        startingPrice: 180000,
                        currentPrice: 210000,
                        startDate: '2025-05-19T14:00:00Z',
                        endDate: '2025-05-24T16:00:00Z',
                        status: 'live',
                        category: 'sports',
                        image: '/api/placeholder/800/600',
                        vehicle: {
                            brand: 'Porsche',
                            model: '911 Turbo S',
                            year: 2023,
                            mileage: 3000
                        },
                        bidCount: 42
                    }
                ];

                setAuctions(mockAuctions);
            } catch (error) {
                console.error('Failed to fetch auctions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const filteredAndSortedAuctions = React.useMemo(() => {
        let filtered = auctions.filter(auction => {
            const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               auction.vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               auction.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        // Sort auctions
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'ending-soon':
                    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                case 'newest':
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                case 'price-low':
                    return a.currentPrice - b.currentPrice;
                case 'price-high':
                    return b.currentPrice - a.currentPrice;
                case 'most-bids':
                    return b.bidCount - a.bidCount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [auctions, searchQuery, selectedCategory, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }
        setSearchParams(params);
    };

    const formatTimeRemaining = (endDate: string) => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const diff = end - now;

        if (diff <= 0) return 'Auction ended';

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

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="auctions-page">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading auctions...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="auctions-page">
                <div className="auctions-container">
                    {/* Header */}
                    <div className="auctions-header">
                        <div className="header-content">
                            <h1>Live Auctions</h1>
                            <p>Discover and bid on premium vehicles from around the world</p>
                        </div>
                        
                        {/* Search and Filters */}
                        <div className="search-filters-section">
                            <form onSubmit={handleSearch} className="search-form">
                                <div className="search-input-group">
                                    <Search className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by make, model, or auction title..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <button type="submit" className="search-btn">
                                    Search
                                </button>
                            </form>

                            <div className="filters-toolbar">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`filter-toggle ${showFilters ? 'active' : ''}`}
                                >
                                    <Filter size={20} />
                                    Filters
                                </button>

                                <div className="view-controls">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {showFilters && (
                                <div className="filters-panel">
                                    <div className="filter-group">
                                        <label>Category</label>
                                        <div className="category-filters">
                                            {categories.map(category => (
                                                <button
                                                    key={category.value}
                                                    onClick={() => setSelectedCategory(category.value)}
                                                    className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
                                                >
                                                    {category.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="auctions-results">
                        <div className="results-header">
                            <p className="results-count">
                                {filteredAndSortedAuctions.length} auction{filteredAndSortedAuctions.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {filteredAndSortedAuctions.length === 0 ? (
                            <div className="empty-results">
                                <div className="empty-icon">
                                    <Gavel size={64} />
                                </div>
                                <h3>No auctions found</h3>
                                <p>Try adjusting your search criteria or filters</p>
                            </div>
                        ) : (
                            <div className={`auctions-grid ${viewMode}`}>
                                {filteredAndSortedAuctions.map((auction) => (
                                    <Link
                                        key={auction.auction_id}
                                        to={`/auction/${auction.auction_id}`}
                                        className="auction-card"
                                    >
                                        <div className="auction-image">
                                            <img
                                                src={auction.image}
                                                alt={auction.title}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/api/placeholder/400/300';
                                                }}
                                            />
                                            <div className="auction-overlay">
                                                <span className={`status-badge ${auction.status}`}>
                                                    {auction.status === 'live' ? 'Live' : 'Upcoming'}
                                                </span>
                                                <div className="auction-actions">
                                                    <button className="action-btn" onClick={(e) => e.preventDefault()}>
                                                        <Heart size={16} />
                                                    </button>
                                                    <button className="action-btn" onClick={(e) => e.preventDefault()}>
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="auction-info">
                                            <h3 className="auction-title">{auction.title}</h3>
                                            <p className="auction-details">
                                                {auction.vehicle.year} • {auction.vehicle.mileage.toLocaleString()} miles
                                            </p>

                                            <div className="auction-stats">
                                                <div className="price-info">
                                                    <div className="current-price">
                                                        {formatPrice(auction.currentPrice)}
                                                    </div>
                                                    <div className="bid-count">
                                                        <Gavel size={14} />
                                                        {auction.bidCount} bids
                                                    </div>
                                                </div>                                                <div className="time-info">
                                                    <div className="time-remaining">
                                                        <Clock size={14} />
                                                        <CountdownTimer 
                                                            endDate={auction.endDate}
                                                            size="sm"
                                                            showLabels={false}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auctions;
