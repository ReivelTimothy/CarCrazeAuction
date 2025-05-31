import { fetchFromAPI } from './api';
import type { Transaction } from '../types/types';

export const getTransactionById = (id: string): Promise<Transaction> => {
  return fetchFromAPI(`/transaction/${id}/getTransaction`, 'GET');
};

export const getTransactionsByUserId = (userId: string): Promise<Transaction[]> => {
  return fetchFromAPI(`/transaction/${userId}/getTransactionByUserId`, 'GET');
};

export const createTransaction = (transactionData: {
  user_id: string;
  auction_id: string;
  amount: number;
  paymentMethod?: string;
}): Promise<Transaction> => {
  return fetchFromAPI('/transaction/createTransaction', 'POST', transactionData);
};

export const updateTransactionStatus = (id: string, status: string): Promise<Transaction> => {
  return fetchFromAPI(`/transaction/${id}/updateTransactionStatus`, 'PUT', { status });
};

export const deleteTransaction = (id: string): Promise<{ message: string }> => {
  return fetchFromAPI(`/transaction/${id}/deleteTransaction`, 'DELETE');
};
