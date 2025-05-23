import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Car, Gauge, Calendar, Palette, Fuel, Settings, Eye, Heart } from 'lucide-react';
import Navbar from '../components/navbar';
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import '../styles/vehicles.css';

interface Vehicle {
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
    images: string[];
    price: number;
    location: string;
    description: string;
    isAuctionActive: boolean;
    auctionId?: string;
}

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [yearRange, setYearRange] = useState([1990, 2025]);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const vehicleTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'coupe', label: 'Coupe' },
        { value: 'convertible', label: 'Convertible' },
        { value: 'truck', label: 'Truck' },
        { value: 'motorcycle', label: 'Motorcycle' }
    ];

    const brands = [
        'all', 'BMW', 'Mercedes-Benz', 'Audi', 'Ferrari', 'Lamborghini', 'Porsche', 
        'Ford', 'Chevrolet', 'Tesla', 'Toyota', 'Honda', 'Nissan'
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'mileage-low', label: 'Mileage: Low to High' },
        { value: 'mileage-high', label: 'Mileage: High to Low' }
    ];

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const response = await fetchFromAPI('vehicles', 'GET');
                
                // Mock data for demonstration
                const mockVehicles: Vehicle[] = [
                    {
                        vehicle_id: '1',
                        type: 'coupe',
                        brand: 'Ferrari',
                        model: '488 GTB',
                        year: 2023,
                        color: 'Rosso Corsa',
                        mileage: 5000,
                        transmissionType: 'Automatic',
                        fuelType: 'Gasoline',
                        condition: 'Excellent',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 285000,
                        location: 'Beverly Hills, CA',
                        description: 'Pristine condition Ferrari with all service records',
                        isAuctionActive: true,
                        auctionId: '1'
                    },
                    {
                        vehicle_id: '2',
                        type: 'coupe',
                        brand: 'Ford',
                        model: 'Mustang Fastback',
                        year: 1967,
                        color: 'Highland Green',
                        mileage: 45000,
                        transmissionType: 'Manual',
                        fuelType: 'Gasoline',
                        condition: 'Restored',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 67500,
                        location: 'Detroit, MI',
                        description: 'Fully restored classic muscle car with numbers matching engine',
                        isAuctionActive: true,
                        auctionId: '2'
                    },
                    {
                        vehicle_id: '3',
                        type: 'sedan',
                        brand: 'Tesla',
                        model: 'Model S Plaid',
                        year: 2024,
                        color: 'Pearl White',
                        mileage: 1000,
                        transmissionType: 'Electric',
                        fuelType: 'Electric',
                        condition: 'Like New',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 120000,
                        location: 'Palo Alto, CA',
                        description: 'Latest Tesla technology with full self-driving capability',
                        isAuctionActive: true,
                        auctionId: '3'
                    },
                    {
                        vehicle_id: '4',
                        type: 'coupe',
                        brand: 'Porsche',
                        model: '911 Turbo S',
                        year: 2023,
                        color: 'GT Silver',
                        mileage: 3000,
                        transmissionType: 'PDK',
                        fuelType: 'Gasoline',
                        condition: 'Excellent',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 210000,
                        location: 'Miami, FL',
                        description: 'Track-ready Porsche with sport package and ceramic brakes',
                        isAuctionActive: true,
                        auctionId: '4'
                    },
                    {
                        vehicle_id: '5',
                        type: 'suv',
                        brand: 'BMW',
                        model: 'X5 M Competition',
                        year: 2023,
                        color: 'Carbon Black',
                        mileage: 8000,
                        transmissionType: 'Automatic',
                        fuelType: 'Gasoline',
                        condition: 'Very Good',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 95000,
                        location: 'New York, NY',
                        description: 'High-performance luxury SUV with M package',
                        isAuctionActive: false
                    },
                    {
                        vehicle_id: '6',
                        type: 'convertible',
                        brand: 'Mercedes-Benz',
                        model: 'SL63 AMG',
                        year: 2022,
                        color: 'Designo Diamond White',
                        mileage: 12000,
                        transmissionType: 'Automatic',
                        fuelType: 'Gasoline',
                        condition: 'Excellent',
                        documents: 'Complete',
                        images: ['/api/placeholder/800/600'],
                        price: 180000,
                        location: 'Los Angeles, CA',
                        description: 'Luxury convertible with AMG performance package',
                        isAuctionActive: false
                    }
                ];

                setVehicles(mockVehicles);
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const filteredAndSortedVehicles = React.useMemo(() => {
        let filtered = vehicles.filter(vehicle => {
            const matchesSearch = vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesBrand = selectedBrand === 'all' || vehicle.brand === selectedBrand;
            const matchesType = selectedType === 'all' || vehicle.type === selectedType;
            const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
            const matchesYear = vehicle.year >= yearRange[0] && vehicle.year <= yearRange[1];
            
            return matchesSearch && matchesBrand && matchesType && matchesPrice && matchesYear;
        });

        // Sort vehicles
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.year - a.year;
                case 'oldest':
                    return a.year - b.year;
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'mileage-low':
                    return a.mileage - b.mileage;
                case 'mileage-high':
                    return b.mileage - a.mileage;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [vehicles, searchQuery, selectedBrand, selectedType, priceRange, yearRange, sortBy]);

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
                <div className="vehicles-page">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading vehicles...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="vehicles-page">
                <div className="vehicles-container">
                    {/* Header */}
                    <div className="vehicles-header">
                        <div className="header-content">
                            <h1>Premium Vehicles</h1>
                            <p>Browse our collection of luxury and classic automobiles</p>
                        </div>
                        
                        {/* Search and Filters */}
                        <div className="search-filters-section">
                            <div className="search-form">
                                <div className="search-input-group">
                                    <Search className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by brand, model, or type..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

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
                                    <div className="filter-row">
                                        <div className="filter-group">
                                            <label>Brand</label>
                                            <select
                                                value={selectedBrand}
                                                onChange={(e) => setSelectedBrand(e.target.value)}
                                                className="filter-select"
                                            >
                                                {brands.map(brand => (
                                                    <option key={brand} value={brand}>
                                                        {brand === 'all' ? 'All Brands' : brand}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label>Type</label>
                                            <select
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                className="filter-select"
                                            >
                                                {vehicleTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label>Price Range</label>
                                            <div className="range-inputs">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                    className="range-input"
                                                />
                                                <span>to</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                                                    className="range-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="filter-group">
                                            <label>Year Range</label>
                                            <div className="range-inputs">
                                                <input
                                                    type="number"
                                                    placeholder="From"
                                                    value={yearRange[0]}
                                                    onChange={(e) => setYearRange([parseInt(e.target.value) || 1990, yearRange[1]])}
                                                    className="range-input"
                                                />
                                                <span>to</span>
                                                <input
                                                    type="number"
                                                    placeholder="To"
                                                    value={yearRange[1]}
                                                    onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || 2025])}
                                                    className="range-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="vehicles-results">
                        <div className="results-header">
                            <p className="results-count">
                                {filteredAndSortedVehicles.length} vehicle{filteredAndSortedVehicles.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {filteredAndSortedVehicles.length === 0 ? (
                            <div className="empty-results">
                                <div className="empty-icon">
                                    <Car size={64} />
                                </div>
                                <h3>No vehicles found</h3>
                                <p>Try adjusting your search criteria or filters</p>
                            </div>
                        ) : (
                            <div className={`vehicles-grid ${viewMode}`}>
                                {filteredAndSortedVehicles.map((vehicle) => (
                                    <div key={vehicle.vehicle_id} className="vehicle-card">
                                        <div className="vehicle-image">
                                            <img
                                                src={vehicle.images[0]}
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/api/placeholder/400/300';
                                                }}
                                            />
                                            <div className="vehicle-overlay">
                                                {vehicle.isAuctionActive && (
                                                    <span className="auction-badge">
                                                        Live Auction
                                                    </span>
                                                )}
                                                <div className="vehicle-actions">
                                                    <button className="action-btn">
                                                        <Heart size={16} />
                                                    </button>
                                                    <button className="action-btn">
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="vehicle-info">
                                            <div className="vehicle-header">
                                                <h3 className="vehicle-title">
                                                    {vehicle.year} {vehicle.brand} {vehicle.model}
                                                </h3>
                                                <div className="vehicle-price">
                                                    {formatPrice(vehicle.price)}
                                                </div>
                                            </div>

                                            <div className="vehicle-specs">
                                                <div className="spec-item">
                                                    <Gauge size={16} />
                                                    <span>{vehicle.mileage.toLocaleString()} miles</span>
                                                </div>
                                                <div className="spec-item">
                                                    <Calendar size={16} />
                                                    <span>{vehicle.year}</span>
                                                </div>
                                                <div className="spec-item">
                                                    <Palette size={16} />
                                                    <span>{vehicle.color}</span>
                                                </div>
                                                <div className="spec-item">
                                                    <Fuel size={16} />
                                                    <span>{vehicle.fuelType}</span>
                                                </div>
                                                <div className="spec-item">
                                                    <Settings size={16} />
                                                    <span>{vehicle.transmissionType}</span>
                                                </div>
                                            </div>

                                            <div className="vehicle-details">
                                                <p className="vehicle-location">{vehicle.location}</p>
                                                <p className="vehicle-condition">Condition: {vehicle.condition}</p>
                                            </div>

                                            <div className="vehicle-actions-bottom">
                                                {vehicle.isAuctionActive ? (
                                                    <Link
                                                        to={`/auction/${vehicle.auctionId}`}
                                                        className="primary-btn"
                                                    >
                                                        View Auction
                                                    </Link>
                                                ) : (
                                                    <button className="primary-btn">
                                                        Contact Seller
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/vehicle/${vehicle.vehicle_id}`}
                                                    className="secondary-btn"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vehicles;
