import { fetchFromAPI } from './api';
import type { Auction, CreateAuctionData } from '../types/types';
import { prepareAuctionFormData } from '../utils/formUtils';

export const getAllAuctions = (): Promise<Auction[]> => {
  return fetchFromAPI('/auction/getAllAuctions', 'GET');
};

export const getAuctionById = (id: string): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/getAuction`, 'GET');
};

export const createAuction = (auctionData: CreateAuctionData): Promise<Auction> => {
  const formData = prepareAuctionFormData(auctionData);
  return fetchFromAPI('/auction/createAuction', 'POST', formData);
};

export const updateAuctionStatus = (id: string, status: 'active' | 'closed' | 'pending'): Promise<Auction> => {
  return fetchFromAPI(`/auction/${id}/updateAuctionStatus`, 'PUT', { status });
};