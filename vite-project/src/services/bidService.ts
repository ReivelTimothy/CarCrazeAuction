import { fetchFromAPI } from './api';
import type { Bid } from '../types/types';

export const getHighestBid = async (auctionId: string): Promise<Bid | null> => {
  try {
    return await fetchFromAPI(`/bid/${auctionId}/getHighestBid`, 'GET');
  } catch (error) {
    // Check if the error is related to no bids found
    if (error instanceof Error && 
        (error.message === 'No bids found for this auction' || 
         error.message === 'No bids found')) {
      console.log('No bids found for auction', auctionId);
      return null;
    }
    throw error; // Re-throw other errors
  }
};

export const getBidHistory = async (auctionId: string): Promise<Bid[]> => {
  try {
    return await fetchFromAPI(`/bid/${auctionId}/history`, 'GET');
  } catch (error) {
    if (error instanceof Error && 
        (error.message === 'No bids found for this auction' || 
         error.message === 'No bids found')) {
      console.log('No bid history found for auction', auctionId);
      return [];
    }
    throw error;
  }
};

export const updateBidPrice = (auctionId: string, amount: number): Promise<Bid> => {
  return fetchFromAPI(`/bid/${auctionId}/updateBidPrice`, 'PUT', { auction_id: auctionId, amount });
};

export const placeBid = async (auctionId: string, amountt: number, userId:string): Promise<Bid> => {
  // This endpoint might need to be created in your backend
  const amount = amountt 
  console.log("Placing bid for auction:", auctionId, "with amount:", amount, "in service", "by user:", userId);  try {
    const response = await fetchFromAPI(`/bid/${auctionId}/placeBid`, 'POST', { amount, user_id: userId });
    
    // Check if auction end date was extended due to last-minute bid
    if (response.auctionEndDate) {
      console.log("Auction end time extended to:", new Date(response.auctionEndDate));
      // You can emit an event or return this information to update the UI
    }
    
    return response;
  } catch (error: any) {
    // Provide more user-friendly error messages based on backend responses
    if (error.message.includes('already the highest bidder')) {
      throw new Error('You are already the highest bidder for this auction.');
    } else if (error.message.includes('must be at least')) {
      throw new Error('Your bid is too low. Please increase your bid amount.');
    } else if (error.message.includes('auction has ended')) {
      throw new Error('This auction has already ended. No more bids can be placed.');
    } else if (error.message.includes('auction is already closed')) {
      throw new Error('This auction is closed. No more bids can be placed.');
    } else {
      // For any other error, just pass it through
      throw error;
    }
  }
};