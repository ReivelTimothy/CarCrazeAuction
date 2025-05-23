import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  register: (userData: { 
    username: string; 
    email: string; 
    password: string;
    phone?: string;
    address?: string;
  }) => api.post('/auth/register', userData),
  
  verifyToken: () => api.get('/auth/verify'),
  
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Auctions API calls
export const auctionsAPI = {
  getAll: (params?: { 
    category?: string; 
    search?: string;
    sort?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/auction/getAllAuctions', { params }),
  
  getById: (id: string) => api.get(`/auction/${id}/getAuction`),
  
  create: (auctionData: {
    vehicle_id: string;
    title: string;
    description: string;
    startingPrice: number;
    status: string;
    category: string;
    image?: string;
    endDate?: string;
  }) => api.post('/auction/createAuction', auctionData),
  
  update: (id: string, data: any) => 
    api.put(`/auction/${id}/updateAuction`, data),
  
  updateStatus: (id: string, status: string) => 
    api.put(`/auction/${id}/updateAuctionStatus`, { status }),
    
  getFeatured: () => api.get('/auction/featured'),
  
  getByUser: (userId: string) => api.get(`/auction/user/${userId}`),
};

// Bids API calls
export const bidsAPI = {
  create: (bidData: { 
    auction_id: string; 
    amount: number;
  }) => api.post('/bid/createBid', bidData),
  
  getByAuction: (auctionId: string) => 
    api.get(`/bid/${auctionId}/getBids`),
  
  getHighestBid: (auctionId: string) => 
    api.get(`/bid/${auctionId}/getHighestBid`),
    
  getByUser: (userId: string) => 
    api.get(`/bid/user/${userId}/getBids`),
};

// Vehicles API calls
export const vehiclesAPI = {
  getAll: (params?: {
    brand?: string;
    type?: string;
    year?: number;
    search?: string;
  }) => api.get('/vehicle/getAllVehicles', { params }),
  
  getById: (id: string) => api.get(`/vehicle/${id}/getVehicle`),
  
  create: (vehicleData: {
    brand: string;
    model: string;
    type: string;
    year: number;
    color: string;
    mileage: number;
    transmissionType: string;
    fuelType: string;
    condition: string;
    documents: string;
  }) => api.post('/vehicle/createVehicle', vehicleData),
  
  update: (id: string, data: any) => 
    api.put(`/vehicle/${id}/updateVehicle`, data),
};

// Users API calls
export const usersAPI = {
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (data: {
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => api.put('/user/updateProfile', data),
  
  getWatchlist: () => api.get('/user/watchlist'),
  
  addToWatchlist: (auctionId: string) => 
    api.post('/user/watchlist/add', { auction_id: auctionId }),
  
  removeFromWatchlist: (auctionId: string) => 
    api.delete(`/user/watchlist/remove/${auctionId}`),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  
  updateUser: (id: string, data: any) => 
    api.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: string) => 
    api.delete(`/admin/users/${id}`),
    
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Default export for backward compatibility
export default {
  auth: authAPI,
  auctions: auctionsAPI,
  bids: bidsAPI,
  vehicles: vehiclesAPI,
  users: usersAPI,
  admin: adminAPI,
};
