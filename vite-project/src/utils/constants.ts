/**
 * Application constants and configuration values
 * Centralized location for all constants used across the application
 */

// ===== API CONFIGURATION =====
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    // User endpoints
    USER_REGISTER: '/user/register',
    USER_LOGIN: '/user/login',
    USER_LOGOUT: '/user/logout',
    USER_PROFILE: '/user/getUserProfile',
    USER_UPDATE: '/user/updateUser',
    USER_DELETE: '/user/deleteUser',
    
    // Auction endpoints
    AUCTION_CREATE: '/auction/createAuction',
    AUCTION_GET_ALL: '/auction/getAllAuctions',
    AUCTION_GET_BY_ID: '/auction/:auction_id/getAuction',
    AUCTION_UPDATE_STATUS: '/auction/:auction_id/updateAuctionStatus',
    
    // Bid endpoints
    BID_GET_HIGHEST: '/bid/:auction_id/getHighestBid',
    BID_UPDATE_PRICE: '/bid/:auction_id/updateBidPrice',
    BID_PLACE: '/bid/:auction_id/placeBid',
    
    // Vehicle endpoints
    VEHICLE_GET_ALL: '/vehicle/',
    VEHICLE_GET_BY_ID: '/vehicle/:id/getVehicle',
    VEHICLE_CREATE: '/vehicle/createVehicle',
    VEHICLE_UPDATE: '/vehicle/:id/updateVechicle',
    VEHICLE_DELETE: '/vehicle/:id/deleteVehicle',
  }
} as const;

// ===== AUCTION CONSTANTS =====
export const AUCTION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'closed',
  PENDING: 'pending'
} as const;

export const AUCTION_DEFAULTS = {
  DURATION_DAYS: 7,
  MIN_BID_INCREMENT: 100
} as const;

// ===== VALIDATION CONSTANTS =====
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  PHONE_PATTERN: /^[0-9]{10,15}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// ===== HTTP STATUS CODES =====
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_MISSING: 'No token provided',
  TOKEN_INVALID: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  
  // Validation errors
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must be at least 6 characters',
  INVALID_PHONE: 'Invalid phone number format',
  
  // Resource errors
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  AUCTION_NOT_FOUND: 'Auction not found',
  BID_NOT_FOUND: 'Bid not found',
  VEHICLE_NOT_FOUND: 'Vehicle not found',
  
  // Server errors
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_ERROR: 'Internal server error',
  FILE_UPLOAD_ERROR: 'File upload failed'
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGIN: 'Login successful',
  USER_LOGOUT: 'Logout successful',
  AUCTION_CREATED: 'Auction created successfully',
  BID_PLACED: 'Bid placed successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
} as const;
