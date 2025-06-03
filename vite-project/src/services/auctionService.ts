import { fetchFromAPI } from './api';
import type { Auction, AdminStatistics } from '../types/types';

export const getAllAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/auction/getAllAuctions', 'GET');
};

export const getAuctionById = (id: string): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/getAuction`, 'GET');
};

export const createAuction = (auctionData: Partial<Auction>): Promise<Auction> => {
  const formData = new FormData();

  if (auctionData.title) formData.append('title', auctionData.title);
  if (auctionData.description) formData.append('description', auctionData.description);
  if (auctionData.startingPrice !== undefined)
    formData.append('startingPrice', String(auctionData.startingPrice));
  if (auctionData.status) formData.append('status', auctionData.status);
  if (auctionData.category) formData.append('category', auctionData.category);
  if (auctionData.vehicle_id) formData.append('vehicle_id', auctionData.vehicle_id);
  if (auctionData.image) {
    console.log("Image path:", auctionData.image);
    formData.append('image', auctionData.image);
  }
  console.log("FormData:", formData.get('image'));

  return fetch('http://localhost:3000/admin/createAuction', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create auction');
    return res.json();
  });
};

export const updateAuctionStatus = (id: string, status: 'active' | 'closed' | 'pending'): Promise<Auction> => {
  // Convert 'active' to 'OPEN' for the backend
  const backendStatus = status === 'active' ? 'OPEN' : status;
  return fetchFromAPI(`/admin/${id}/updateAuctionStatus`, 'PUT', { status: backendStatus });
};

// New functions for user participation data
export const getUserParticipatedAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/bid/user/participated', 'GET');
};

export const getUserWonAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/bid/user/won', 'GET');
};

// Admin statistics function
export const getAdminStatistics = (): Promise<AdminStatistics> => {
  return fetchFromAPI('/admin/statistics', 'GET');
};

// Function to check auction end status and determine winner
export const checkAuctionEndAndDetermineWinner = (auctionId: string): Promise<{
  message: string;
  winner?: boolean;
  winnerId?: string;
  winningAmount?: number;
  transactionId?: string;
  transactionStatus?: string;
  status?: string;
  timeRemaining?: number;
  endDate?: string;
}> => {
  return fetchFromAPI(`/auction/${auctionId}/check-end`, 'GET');
};

// Function to check if current user is the winner and get transaction details
export const checkUserIsWinnerAndGetTransaction = (auctionId: string): Promise<{
  isWinner: boolean;
  transaction?: any;
  message: string;
}> => {
  return fetchFromAPI(`/transaction/auction/${auctionId}/check-winner`, 'GET');
};