import React, { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { 
  Users, Car, Gavel, Activity, Clock, 
  PlusCircle, Edit, Trash, Search, Filter, 
  AlertTriangle, CheckCircle, X
} from 'lucide-react';
import Navbar from '../components/navbar';
import CountdownTimer from '../components/CountdownTimer';
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import '../styles/admin-dashboard.css';

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  bids?: number;
  auctions?: number;
}

interface Vehicle {
  vehicle_id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  color: string;
  mileage: number;
  transmissionType: string;
  fuelType: string;
  condition: string;
  status: string;
}

interface Auction {
  auction_id: string;
  title: string;
  currentPrice: number;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  bidCount: number;
  vehicle: {
    vehicle_id: string;
    brand: string;
    model: string;
    year: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch data based on active tab
        switch(activeTab) {
          case 0: // Dashboard
            await Promise.all([
              fetchUsers(),
              fetchVehicles(),
              fetchAuctions()
            ]);
            break;
          case 1: // Users
            await fetchUsers();
            break;
          case 2: // Vehicles
            await fetchVehicles();
            break;
          case 3: // Auctions
            await fetchAuctions();
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const fetchUsers = async () => {
    // In a real app, this would be an API call
    // const response = await fetchFromAPI("/admin/users", "GET");
    // setUsers(response);
    
    // Simulated data
    setUsers([
      { user_id: "1", username: "john_doe", email: "john@example.com", role: "user", createdAt: "2025-04-15", status: "active", bids: 12, auctions: 0 },
      { user_id: "2", username: "jane_smith", email: "jane@example.com", role: "user", createdAt: "2025-04-20", status: "active", bids: 8, auctions: 1 },
      { user_id: "3", username: "admin_user", email: "admin@example.com", role: "admin", createdAt: "2025-03-01", status: "active", bids: 0, auctions: 5 },
      { user_id: "4", username: "suspended_user", email: "suspended@example.com", role: "user", createdAt: "2025-04-10", status: "suspended", bids: 3, auctions: 0 },
      { user_id: "5", username: "alice_johnson", email: "alice@example.com", role: "user", createdAt: "2025-04-22", status: "active", bids: 5, auctions: 2 },
    ]);
  };

  const fetchVehicles = async () => {
    // In a real app, this would be an API call
    // const response = await fetchFromAPI("/admin/vehicles", "GET");
    // setVehicles(response);
    
    // Simulated data
    setVehicles([
      { vehicle_id: "1", brand: "BMW", model: "M5", year: 2023, type: "Sedan", color: "Blue", mileage: 1500, transmissionType: "Automatic", fuelType: "Gasoline", condition: "New", status: "available" },
      { vehicle_id: "2", brand: "Mercedes-Benz", model: "S-Class", year: 2022, type: "Sedan", color: "Black", mileage: 5000, transmissionType: "Automatic", fuelType: "Gasoline", condition: "Used", status: "in-auction" },
      { vehicle_id: "3", brand: "Audi", model: "R8", year: 2023, type: "Sports", color: "Red", mileage: 800, transmissionType: "Automatic", fuelType: "Gasoline", condition: "New", status: "available" },
      { vehicle_id: "4", brand: "Porsche", model: "911", year: 2021, type: "Sports", color: "Yellow", mileage: 12000, transmissionType: "Manual", fuelType: "Gasoline", condition: "Used", status: "in-auction" },
      { vehicle_id: "5", brand: "Tesla", model: "Model S", year: 2023, type: "Sedan", color: "White", mileage: 3000, transmissionType: "Automatic", fuelType: "Electric", condition: "Used", status: "sold" },
    ]);
  };

  const fetchAuctions = async () => {
    // In a real app, this would be an API call
    // const response = await fetchFromAPI("/admin/auctions", "GET");
    // setAuctions(response);
    
    // Simulated data
    setAuctions([
      { 
        auction_id: "1", 
        title: "Luxury BMW M5 2023", 
        currentPrice: 80000000, 
        startDate: "2025-04-15T00:00:00Z", 
        endDate: "2025-05-30T00:00:00Z", 
        status: "open",
        category: "Luxury",
        bidCount: 8,
        vehicle: { vehicle_id: "1", brand: "BMW", model: "M5", year: 2023 }
      },
      { 
        auction_id: "2", 
        title: "Mercedes-Benz S-Class 2022", 
        currentPrice: 75000000, 
        startDate: "2025-04-20T00:00:00Z", 
        endDate: "2025-05-25T00:00:00Z", 
        status: "open",
        category: "Luxury",
        bidCount: 5,
        vehicle: { vehicle_id: "2", brand: "Mercedes-Benz", model: "S-Class", year: 2022 }
      },
      { 
        auction_id: "3", 
        title: "Audi R8 2023 Sports Car", 
        currentPrice: 90000000, 
        startDate: "2025-04-10T00:00:00Z", 
        endDate: "2025-04-20T00:00:00Z", 
        status: "closed",
        category: "Sports",
        bidCount: 12,
        vehicle: { vehicle_id: "3", brand: "Audi", model: "R8", year: 2023 }
      },
      { 
        auction_id: "4", 
        title: "Porsche 911 2021", 
        currentPrice: 85000000, 
        startDate: "2025-04-25T00:00:00Z", 
        endDate: "2025-06-10T00:00:00Z", 
        status: "upcoming",
        category: "Sports",
        bidCount: 0,
        vehicle: { vehicle_id: "4", brand: "Porsche", model: "911", year: 2021 }
      },
      { 
        auction_id: "5", 
        title: "Tesla Model S 2023", 
        currentPrice: 65000000, 
        startDate: "2025-04-12T00:00:00Z", 
        endDate: "2025-05-12T00:00:00Z", 
        status: "open",
        category: "Electric",
        bidCount: 3,
        vehicle: { vehicle_id: "5", brand: "Tesla", model: "Model S", year: 2023 }
      },
    ]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDeleteClick = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // In a real app, this would be an API call
      // await fetchFromAPI(`/admin/${itemToDelete.type}/${itemToDelete.id}`, "DELETE");

      // Update local state based on what was deleted
      switch(itemToDelete.type) {
        case 'user':
          setUsers(prevUsers => prevUsers.filter(user => user.user_id !== itemToDelete.id));
          break;
        case 'vehicle':
          setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.vehicle_id !== itemToDelete.id));
          break;
        case 'auction':
          setAuctions(prevAuctions => prevAuctions.filter(auction => auction.auction_id !== itemToDelete.id));
          break;
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && user.status === statusFilter;
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && vehicle.status === statusFilter;
  });

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = 
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      auction.vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && auction.status === statusFilter;
  });

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, vehicles, and auctions</p>
        </div>

        <div className="admin-tabs-container">
          <Tabs selectedIndex={activeTab} onSelect={(index: number) => setActiveTab(index)}>
            <TabList className="admin-tab-list">
              <Tab className="admin-tab" selectedClassName="admin-tab-selected">
                <Activity size={18} />
                Dashboard
              </Tab>
              <Tab className="admin-tab" selectedClassName="admin-tab-selected">
                <Users size={18} />
                Users
              </Tab>
              <Tab className="admin-tab" selectedClassName="admin-tab-selected">
                <Car size={18} />
                Vehicles
              </Tab>
              <Tab className="admin-tab" selectedClassName="admin-tab-selected">
                <Gavel size={18} />
                Auctions
              </Tab>
            </TabList>

            {/* Dashboard Overview */}
            <TabPanel>
              <div className="admin-panel">
                <h2 className="panel-title">Dashboard Overview</h2>

                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users />
                    </div>
                    <div className="stat-info">
                      <h3>Users</h3>
                      <p className="stat-value">{users.length}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Car />
                    </div>
                    <div className="stat-info">
                      <h3>Vehicles</h3>
                      <p className="stat-value">{vehicles.length}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Gavel />
                    </div>
                    <div className="stat-info">
                      <h3>Auctions</h3>
                      <p className="stat-value">{auctions.length}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Clock />
                    </div>
                    <div className="stat-info">
                      <h3>Active Auctions</h3>
                      <p className="stat-value">{auctions.filter(a => a.status === 'open').length}</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-recent-section">
                  <div className="dashboard-recent">
                    <h3>Recent Auctions</h3>
                    <div className="recent-list">
                      {auctions.slice(0, 3).map(auction => (
                        <div key={auction.auction_id} className="recent-item">
                          <div className="recent-info">
                            <h4>{auction.title}</h4>
                            <p>{formatPrice(auction.currentPrice)} • {auction.bidCount} bids</p>
                          </div>
                          <div className="recent-status">
                            <span className={`status-badge status-${auction.status}`}>
                              {auction.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dashboard-recent">
                    <h3>Recent Users</h3>
                    <div className="recent-list">
                      {users.slice(0, 3).map(user => (
                        <div key={user.user_id} className="recent-item">
                          <div className="recent-info">
                            <h4>{user.username}</h4>
                            <p>{user.email} • {user.role}</p>
                          </div>
                          <div className="recent-status">
                            <span className={`status-badge status-${user.status}`}>
                              {user.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Users Management */}
            <TabPanel>
              <div className="admin-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Users Management</h2>
                    <p className="panel-subtitle">Manage platform users and their permissions</p>
                  </div>
                  
                  <button className="admin-button">
                    <PlusCircle size={18} />
                    Add User
                  </button>
                </div>

                <div className="admin-filters">
                  <div className="search-filter">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="status-filter">
                    <Filter size={18} />
                    <select 
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.user_id}>
                          <td>{user.user_id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                          <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="actions">
                            <button className="action-btn edit-btn" title="Edit User">
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-btn delete-btn" 
                              title="Delete User"
                              onClick={() => handleDeleteClick(user.user_id, 'user')}
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="empty-table-message">
                      <AlertTriangle size={48} />
                      <p>No users found matching your criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>

            {/* Vehicles Management */}
            <TabPanel>
              <div className="admin-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Vehicles Management</h2>
                    <p className="panel-subtitle">Manage vehicle listings and details</p>
                  </div>
                  
                  <button className="admin-button">
                    <PlusCircle size={18} />
                    Add Vehicle
                  </button>
                </div>

                <div className="admin-filters">
                  <div className="search-filter">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search vehicles..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="status-filter">
                    <Filter size={18} />
                    <select 
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="in-auction">In Auction</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map(vehicle => (
                        <tr key={vehicle.vehicle_id}>
                          <td>{vehicle.vehicle_id}</td>
                          <td>{vehicle.brand}</td>
                          <td>{vehicle.model}</td>
                          <td>{vehicle.year}</td>
                          <td>{vehicle.type}</td>
                          <td><span className={`status-badge status-${vehicle.status}`}>{vehicle.status}</span></td>
                          <td className="actions">
                            <button className="action-btn edit-btn" title="Edit Vehicle">
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-btn delete-btn" 
                              title="Delete Vehicle"
                              onClick={() => handleDeleteClick(vehicle.vehicle_id, 'vehicle')}
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredVehicles.length === 0 && (
                    <div className="empty-table-message">
                      <AlertTriangle size={48} />
                      <p>No vehicles found matching your criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>

            {/* Auctions Management */}
            <TabPanel>
              <div className="admin-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Auctions Management</h2>
                    <p className="panel-subtitle">Manage ongoing and upcoming auctions</p>
                  </div>
                  
                  <button className="admin-button">
                    <PlusCircle size={18} />
                    Create Auction
                  </button>
                </div>

                <div className="admin-filters">
                  <div className="search-filter">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search auctions..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="status-filter">
                    <Filter size={18} />
                    <select 
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Vehicle</th>
                        <th>Current Price</th>
                        <th>Status</th>
                        <th>Time Remaining</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuctions.map(auction => (
                        <tr key={auction.auction_id}>
                          <td>{auction.auction_id}</td>
                          <td>{auction.title}</td>
                          <td>{`${auction.vehicle.brand} ${auction.vehicle.model} (${auction.vehicle.year})`}</td>
                          <td className="price">{formatPrice(auction.currentPrice)}</td>
                          <td><span className={`status-badge status-${auction.status}`}>{auction.status}</span></td>
                          <td>
                            {auction.status === 'closed' ? (
                              <span>Auction Ended</span>
                            ) : (
                              <CountdownTimer 
                                endDate={auction.endDate}
                                size="sm"
                                showLabels={false}
                              />
                            )}
                          </td>
                          <td className="actions">
                            <button className="action-btn edit-btn" title="Edit Auction">
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-btn delete-btn" 
                              title="Delete Auction"
                              onClick={() => handleDeleteClick(auction.auction_id, 'auction')}
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredAuctions.length === 0 && (
                    <div className="empty-table-message">
                      <AlertTriangle size={48} />
                      <p>No auctions found matching your criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <button className="close-modal" onClick={() => setShowDeleteModal(false)}>
              <X size={20} />
            </button>
            <AlertTriangle size={48} className="warning-icon" />
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
