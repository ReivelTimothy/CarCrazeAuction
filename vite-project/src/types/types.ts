// User types
export interface User {
  user_id: string;
  username: string;
  email: string;
  password?: string;
  phoneNum: string;
  role?: 'user' | 'admin';
}

// Vehicle types
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
  name: string;
}

// Auction types
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

// Bid types
export interface Bid {
  bid_id: string;
  user_id: string;
  auction_id: string;
  amount: number;
  bidTime: string | Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phoneNum: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface APIResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}