// pages/Home.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllAuctions } from "../services/auctionService";
import { getVehicleById } from "../services/vehicleService";
import "../styles/home.css";
import type { Auction, Vehicle } from "../types/types";

interface AuctionWithVehicle extends Auction {
  vehicle?: Vehicle;
}

const Home: React.FC = () => {
    const [auctions, setAuctions] = useState<AuctionWithVehicle[]>([]);    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    // const { user } = useAuth(); // Currently unused
    const navigate = useNavigate();
    
    const categoryOptions = [
        "All",
        "Sedan",
        "SUV",
        "Hatchback",
        "Truck",
        "Coupe",
        "Convertible",
        "Van",
        "Wagon"
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const mileageSortOptions = [
        { label: "Default", value: "default" },
        { label: "Lowest to Highest", value: "asc" },
        { label: "Highest to Lowest", value: "desc" }
    ];
    const [mileageSort, setMileageSort] = useState<string>("default");
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setIsLoading(true);
                const auctionsData = await getAllAuctions();
                
                // Fetch vehicle details for each auction
                const auctionsWithVehicles = await Promise.all(
                    auctionsData.map(async (auction: Auction) => {
                        try {
                            const vehicleData = await getVehicleById(auction.vehicle_id);
                            return {
                                ...auction,
                                vehicle: vehicleData
                            };
                        } catch (error) {
                            console.error(`Error fetching vehicle ${auction.vehicle_id}:`, error);
                            return auction;
                        }
                    })
                    
                );
                setAuctions(auctionsWithVehicles);
            } catch (error) {
                console.error("Error fetching auctions:", error);
                setError("Failed to load auctions. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAuctions();
    }, []);    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    // Function currently unused but may be needed for future features
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const calculateTimeLeft = (endDate: string | Date) => {
        const difference = new Date(endDate).getTime() - new Date().getTime();
        
        if (difference <= 0) {
            return "Auction ended";
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return `${days} days ${hours} hours left`;
    };    
    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Car Craze Auction</h1>
                <p>Discover and bid on premium vehicles</p>
            </div>

            {/* Dropdown Sort/Filter by Category, Mileage, and Search */}
            <div style={{ marginBottom: 24, display: "flex", gap: 24, alignItems: "center" }}>
                <div>
                    <label htmlFor="category-select" style={{ marginRight: 8, fontWeight: 500 }}>Sort by Category:</label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        style={{ padding: 6, borderRadius: 4 }}
                    >
                        {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="mileage-sort" style={{ marginRight: 8, fontWeight: 500 }}>Sort by Mileage:</label>
                    <select
                        id="mileage-sort"
                        value={mileageSort}
                        onChange={e => setMileageSort(e.target.value)}
                        style={{ padding: 6, borderRadius: 4 }}
                    >
                        {mileageSortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        style={{ padding: 6, borderRadius: 4, minWidth: 200 }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <p>Loading auctions...</p>
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : auctions.length === 0 ? (
                <div className="no-auctions">
                    <h2>No active auctions found</h2>
                    <p>Check back later for new listings or create your own auction.</p>
                </div>
            ) : (
                <div className="auctions-grid">
                    {auctions
                        .filter(auction => auction.status !== "pending" && new Date(auction.endDate).getTime() > Date.now())
                        .filter(auction => selectedCategory === "All" || auction.category === selectedCategory)
                        .filter(auction => (auction.vehicle?.mileage ?? 0) > 0)
                        .filter(auction => 
                            auction.title.toLowerCase().includes(searchKeyword.toLowerCase())
                        )
                        .sort((a, b) => {
                            if (mileageSort === "asc") {
                                return (a.vehicle?.mileage ?? 0) - (b.vehicle?.mileage ?? 0);
                            }
                            if (mileageSort === "desc") {
                                return (b.vehicle?.mileage ?? 0) - (a.vehicle?.mileage ?? 0);
                            }
                            // default: no sorting, just filter >0
                            return 0;
                        })
                        .map((auction) => (
                            <div 
                                className="auction-card" 
                                key={auction.auction_id}
                                onClick={() => navigate(`/auction/${auction.auction_id}`)}
                            >
                                <div className="auction-image">
                                    {auction.image ? (
                                        <img src={`http://localhost:3000/uploads/${auction.image}`} alt={auction.title} />
                                    ) : (
                                        <div className="placeholder-image">
                                            <span>{auction.vehicle?.brand || 'Car'}</span>
                                        </div>
                                    )}
                                    <div className="auction-status">{auction.status}</div>
                                </div>
                                <div className="auction-details">
                                    <h3>{auction.title}</h3>
                                    <p className="auction-vehicle">
                                        {auction.vehicle ? 
                                            `${auction.vehicle.year} ${auction.vehicle.brand} ${auction.vehicle.model}` : 
                                            'Vehicle details unavailable'}
                                    </p>
                                    <div className="auction-meta">
                                        <div className="auction-price">
                                            <span>Current Bid</span>
                                            <strong>${auction.currentPrice.toLocaleString()}</strong>
                                        </div>
                                        <div className="auction-time">
                                            <span>Time Left</span>
                                            <strong>{calculateTimeLeft(auction.endDate)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Home;
