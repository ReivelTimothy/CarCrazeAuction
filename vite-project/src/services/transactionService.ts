import { fetchFromAPI } from './api';

// Get all transactions (admin only)
export const getAllTransactions = () => {
  return fetchFromAPI('/transaction/getAllTransactions', 'GET');
};

// Get transaction by ID
export const getTransactionById = (id: string) => {
  return fetchFromAPI(`/transaction/${id}/getTransaction`, 'GET');
};

// Get transactions by user ID
export const getTransactionsByUserId = (userId: string) => {
  return fetchFromAPI(`/transaction/${userId}/getTransactionByUserId`, 'GET');
};

// Create a new transaction
export const createTransaction = (transactionData: {
  user_id: string;
  auction_id: string;
  amount: number;
  paymentMethod?: string;
}) => {
  return fetchFromAPI('/transaction/createTransaction', 'POST', transactionData);
};

// Update transaction status
export const updateTransactionStatus = (id: string, status: string) => {
  return fetchFromAPI(`/transaction/${id}/updateTransactionStatus`, 'PUT', { status });
};

// Check if user is winner and get transaction details
export const checkUserIsWinnerAndGetTransaction = (auctionId: string) => {
  return fetchFromAPI(`/transaction/auction/${auctionId}/check-winner`, 'GET');
};

// Process payment for a winning auction (this would be integrated with a payment gateway in production)
export const processPayment = (transactionId: string, paymentDetails: {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankAccount?: string;
}) => {
  return fetchFromAPI(`/transaction/${transactionId}/process-payment`, 'POST', paymentDetails);
};

// Get current user's transaction history
export const getCurrentUserTransactionHistory = () => {
  return fetchFromAPI('/transaction/my-history', 'GET');
};
