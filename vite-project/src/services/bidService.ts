import { fetchFromAPI } from './api';
import type { Bid } from '../types/types';

export const getHighestBid = async (auctionId: string): Promise<Bid | null> => {
  try {
    return await fetchFromAPI(`/bid/${auctionId}/getHighestBid`, 'GET');
  } catch (error: any) {
    // Check if the error is related to no bids found
    if (error instanceof Error && 
        (error.message === 'No bids found for this auction' || 
         error.message === 'No bids found')) {
      return null;
    }
    throw error; // Re-throw other errors
  }
};

export const updateBidPrice = (auctionId: string, amount: number, userId: string): Promise<Bid> => {
  return fetchFromAPI(`/bid/${auctionId}/updateBidPrice`, 'PUT', { amount, user_id: userId });
};

export const placeBid = (auctionId: string, amount: number, userId: string): Promise<Bid> => {
  return fetchFromAPI(`/bid/${auctionId}/placeBid`, 'POST', { amount, user_id: userId });
};