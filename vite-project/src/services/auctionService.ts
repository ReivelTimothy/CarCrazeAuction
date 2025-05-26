import { fetchFromAPI } from './api';
import type { Auction } from '../types/types';

export const getAllAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/auction/getAllAuctions', 'GET');
};

export const getAuctionById = (id: string): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/getAuction`, 'GET');
};

export const createAuction = (auctionData: {
  title?: string;
  description?: string;
  startingPrice?: number;
  status?: 'pending' | 'active' | 'closed';
  category?: string;
  image?: string | File;
}): Promise<Auction> => {
  const formData = new FormData();

  if (auctionData.title) formData.append('title', auctionData.title);
  if (auctionData.description) formData.append('description', auctionData.description);
  if (auctionData.startingPrice !== undefined) formData.append('startingPrice', String(auctionData.startingPrice));
  if (auctionData.status) formData.append('status', auctionData.status);
  if (auctionData.category) formData.append('category', auctionData.category);
  if (auctionData.image && auctionData.image instanceof File) {
    formData.append('image', auctionData.image);
  }

  return fetch('http://localhost:3000/auction/createAuction', {
    method: 'POST',
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create auction');
    return res.json();
  });
};

export const updateAuctionStatus = (id: string, status: 'active' | 'closed' | 'pending'): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/updateAuctionStatus`, 'PUT', { status });
};