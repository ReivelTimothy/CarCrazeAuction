import { API_CONFIG } from '../utils/constants';

const API_URL = API_CONFIG.BASE_URL;

export const fetchFromAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
  const token = localStorage.getItem('token'); 

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };

  const config: RequestInit = {
    method,
    headers,    
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
      // Special handling for bid 404 errors - we'll throw an error with the specific message
    // so it can be caught and handled appropriately
    if (response.status === 404 && endpoint.includes('/bid/') && endpoint.includes('/getHighestBid')) {
      throw new Error(errorData.message || 'No bids found');
    }
    
    throw new Error(errorData.message || 'Network response was not ok');
  }

  return await response.json();
};