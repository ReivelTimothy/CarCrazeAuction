import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component that demonstrates how to use the API services in React components
 */
export const APIIntegrationExample: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Example usage of the auctionsAPI service
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const { auctionsAPI } = await import('../services/apiService');
      
      // Get all auctions
      const response = await auctionsAPI.getAll({
        category: 'sports',
        sort: 'newest'
      });
      
      // Access the data from the response
      setData(response.data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auctions');
      console.error('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example usage of the authAPI service
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { authAPI } = await import('../services/apiService');
      
      // Login user
      const response = await authAPI.login({ email, password });
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to home page
      navigate('/home');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example usage of the bidsAPI service
  const placeBid = async (auctionId: string, amount: number) => {
    try {
      setLoading(true);
      const { bidsAPI } = await import('../services/apiService');
      
      // Place a bid
      await bidsAPI.updateBidPrice(auctionId, { amount });
      
      // Show success message
      alert('Bid placed successfully!');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place bid');
      console.error('Bid error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example usage of the vehiclesAPI service
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { vehiclesAPI } = await import('../services/apiService');
      
      // Fetch vehicles with filters
      const response = await vehiclesAPI.getAll({
        brand: 'Ferrari',
        type: 'coupe',
        minYear: 2020
      });
      
      // Access the data from the response
      setData(response.data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Usage example of multiple APIs in a complex operation
  const createAuctionForVehicle = async (vehicleData: any, auctionData: any) => {
    try {
      setLoading(true);
      const { vehiclesAPI, auctionsAPI } = await import('../services/apiService');
      
      // First, create a new vehicle
      const vehicleResponse = await vehiclesAPI.create(vehicleData);
      const vehicleId = vehicleResponse.data.vehicle_id;
      
      // Then, create an auction for this vehicle
      const auctionResponse = await auctionsAPI.create({
        ...auctionData,
        vehicle_id: vehicleId
      });
      
      // Navigate to the newly created auction
      navigate(`/auction/${auctionResponse.data.auction_id}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create auction');
      console.error('Error creating auction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>API Integration Examples</h1>
      
      {/* This is just a demonstration component - not meant to be rendered */}
      <p>See the source code for examples of how to integrate with backend APIs</p>
      
      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      <button onClick={() => fetchAuctions()}>Fetch Auctions</button>
      <button onClick={() => fetchVehicles()}>Fetch Vehicles</button>
      <button onClick={() => handleLogin('user@example.com', 'password123')}>Login</button>
    </div>
  );
};

export default APIIntegrationExample;
