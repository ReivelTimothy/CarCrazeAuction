/**
 * Core Type Definitions for CarCraze Auction System
 * Organized by domain entities for better maintainability
 */

// ===== CORE ENTITY TYPES =====

/**
 * User entity representing system users
 */
export interface User {
  user_id: string;
  username: string;
  email: string;
  password?: string;
  phoneNum: string;
}

/**
 * Vehicle entity with comprehensive specifications
 */
export interface Vehicle {
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
}

/**
 * Auction entity with status management
 */
export interface Auction {
  auction_id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  startDate: string | Date;
  endDate: string | Date;
  status: 'OPEN' | 'closed' | 'pending';
  category: string;
  image: string | null;
  vehicle_id: string;
  vehicle?: Vehicle;
}

/**
 * Bid entity for auction bidding system
 */
export interface Bid {
  bid_id: string;
  user_id: string;
  auction_id: string;
  amount: number;
  bidTime: string | Date;
}

/**
 * Transaction entity for payment processing
 */
export interface Transaction {
  transaction_id: string;
  user_id: string;
  auction_id: string;
  amount: number;
  transactionDate: string | Date;
  paymentMethod: string;
  status: string;
}

// ===== AUTH & FORM DATA TYPES =====

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phoneNum: string;
}

/**
 * Authentication response with token
 */
export interface LoginResponse {
  message: string;
  token: string;
}

/**
 * Form data for creating new auctions
 */
export interface CreateAuctionData {
  title: string;
  description: string;
  startingPrice: number;
  status: 'OPEN' | 'closed' | 'pending';
  category: string;
  vehicle_id: string;
  image?: File | string;
}

// ===== API RESPONSE TYPES =====

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}