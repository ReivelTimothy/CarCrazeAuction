// Simplified API service with proper types
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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
    if (token && config.headers) {
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
    api.post('/user/login', credentials),
  
  register: (userData: { 
    username: string; 
    email: string; 
    password: string;
    phone?: string;
    address?: string;
  }) => api.post('/user/register', userData),
  
  logout: () => {
    api.post('/user/logout');
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  
  getUserProfile: () => api.get('/user/getUserProfile'),
  
  updateUserProfile: (userData: any) => api.put('/user/updateUser', userData),
  
  deleteUserProfile: () => api.delete('/user/deleteUser')
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
  
  updateStatus: (id: string, status: string) => 
    api.put(`/auction/${id}/updateAuctionStatus`, { status })
};

// Vehicles API calls
export const vehiclesAPI = {
  getAll: (params?: {
    brand?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number; 
    sort?: string;
    search?: string;
  }) => api.get('/vehicle', { params }),
  
  getById: (id: string) => api.get(`/vehicle/${id}/getVehicle`),
  
  create: (vehicleData: {
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
    images?: string[];
    price?: number;
    description?: string;
  }) => api.post('/vehicle/createVehicle', vehicleData),
  
  update: (id: string, data: any) => 
    api.put(`/vehicle/${id}/updateVechicle`, data),
  
  delete: (id: string) => api.delete(`/vehicle/${id}/deleteVehicle`)
};

// Bids API calls
export const bidsAPI = {
  getHighestBid: (auctionId: string) => 
    api.get(`/bid/${auctionId}/getHighestBid`),
    
  updateBidPrice: (auctionId: string, bidData: { amount: number }) => 
    api.put(`/bid/${auctionId}/updateBidPrice`, bidData)
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users')
};

export default api;
