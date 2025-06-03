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

export const placeBid = (auctionId: string, amountt: number, userId:string): Promise<Bid> => {
  // This endpoint might need to be created in your backend
  const amount = amountt 
  console.log("Placing bid for auction:", auctionId, "with amount:", amount, "in service", "by user:", userId);
  return fetchFromAPI(`/bid/${auctionId}/placeBid`, 'POST', { amount,  user_id:userId});
};