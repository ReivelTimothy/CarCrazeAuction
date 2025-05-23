# Frontend API Integration Guide

This document explains how to integrate the frontend with the backend APIs for data fetching in the CarCrazeAuction application.

## API Service Structure

The frontend API services are organized in the `src/services/apiService.ts` file, which provides the following API modules:

- `authAPI`: Authentication-related API calls (login, register, user profile)
- `auctionsAPI`: Auction-related API calls (get all auctions, get auction by ID, create, update)
- `vehiclesAPI`: Vehicle-related API calls (get all vehicles, get vehicle by ID, create, update, delete)
- `bidsAPI`: Bid-related API calls (get highest bid, update bid price)
- `adminAPI`: Admin-related API calls (not fully implemented yet)

## Base URL Configuration

The API base URL is configured in the `apiService.ts` file. By default, it's set to:

```typescript
const API_BASE_URL = 'http://localhost:3000';
```

Change this to match your backend server URL if needed.

## Authentication

The API service automatically handles authentication by attaching the JWT token from localStorage to each request.

### Login Example

```typescript
// Import the authAPI from the services
import { authAPI } from '../services/apiService';

// In your login function
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.login({ email, password });
    
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    
    // Redirect to home page
    navigate('/home');
  } catch (error) {
    console.error('Login failed:', error);
    // Handle error (show message to user, etc.)
  }
};
```

### Register Example

```typescript
import { authAPI } from '../services/apiService';

const handleRegister = async (userData) => {
  try {
    await authAPI.register({
      username: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phoneNumber
    });
    
    // Redirect to login after successful registration
    navigate('/login', { state: { registered: true } });
  } catch (error) {
    console.error('Registration failed:', error);
    // Handle error
  }
};
```

## Fetching Data

### Get All Auctions Example

```typescript
import { auctionsAPI } from '../services/apiService';

const fetchAuctions = async () => {
  try {
    const response = await auctionsAPI.getAll({
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy
    });
    
    setAuctions(response.data);
  } catch (error) {
    console.error('Failed to fetch auctions:', error);
    // Handle error
  }
};
```

### Get Auction by ID Example

```typescript
import { auctionsAPI } from '../services/apiService';

const fetchAuctionDetails = async (id) => {
  try {
    const response = await auctionsAPI.getById(id);
    setAuction(response.data);
  } catch (error) {
    console.error('Failed to fetch auction details:', error);
    // Handle error
  }
};
```

## Creating and Updating Data

### Place a Bid Example

```typescript
import { bidsAPI } from '../services/apiService';

const placeBid = async (auctionId, bidAmount) => {
  try {
    await bidsAPI.updateBidPrice(auctionId, { amount: bidAmount });
    
    // Success message
    setSuccess('Bid placed successfully!');
    
    // Refresh data
    fetchAuctionDetails(auctionId);
  } catch (error) {
    console.error('Failed to place bid:', error);
    // Handle error
  }
};
```

### Create Vehicle Example

```typescript
import { vehiclesAPI } from '../services/apiService';

const createVehicle = async (vehicleData) => {
  try {
    const response = await vehiclesAPI.create(vehicleData);
    
    // Do something with the created vehicle
    console.log('Vehicle created:', response.data);
  } catch (error) {
    console.error('Failed to create vehicle:', error);
    // Handle error
  }
};
```

## Using Custom Hooks for API Calls

For more advanced usage, we've created a custom hook called `useApiRequest` in `src/hooks/useApiRequest.ts`. This hook simplifies the process of making API calls and handling loading, error, and data states.

### Example usage:

```typescript
import { useApiRequest } from '../hooks/useApiRequest';
import { auctionsAPI } from '../services/apiService';

const MyComponent = () => {
  const { data, loading, error } = useApiRequest(
    () => auctionsAPI.getAll(),
    [], // dependencies array
    true // call immediately on mount
  );
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      {data?.map(auction => (
        <div key={auction.auction_id}>{auction.title}</div>
      ))}
    </div>
  );
};
```

## Protected Routes

The application includes a `ProtectedRoute` component that can be used to protect routes that require authentication:

```typescript
import ProtectedRoute from './components/ProtectedRoute';

// In your routes configuration:
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Error Handling

All API calls include proper error handling. You can catch errors from API calls and display appropriate messages to users:

```typescript
try {
  const response = await auctionsAPI.getAll();
  // Handle successful response
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error response:', error.response.data);
    setError(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Error request:', error.request);
    setError('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request
    console.error('Error message:', error.message);
    setError('Failed to make request. Please try again.');
  }
}
```

## Conclusion

By using these API services, you can easily integrate your frontend with the backend APIs for data fetching and manipulation. The service handles authentication automatically and provides a clean interface for making requests.

For more examples, see the `APIIntegrationExample.tsx` component, which demonstrates how to use the API services in React components.
