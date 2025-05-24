import { fetchFromAPI } from './api';
import type { Auction } from '../types/types';

export const getAllAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/auction/getAllAuctions', 'GET');
};

export const getAuctionById = (id: string): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/getAuction`, 'GET');
};

export const createAuction = (auctionData: Partial<Auction>): Promise<Auction> => {
  return fetchFromAPI('/auction/createAuction', 'POST', auctionData);
};

export const updateAuctionStatus = (id: string, status: 'active' | 'closed' | 'pending'): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/updateAuctionStatus`, 'PUT', { status });
};