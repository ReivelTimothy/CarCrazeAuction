import express from 'express';
import { createTransaction, getAllTransactions, getTransactionById, getTransactionByUserId, updateTransactionStatus, deleteTransaction, getTransactionByVehicleId, checkUserIsWinnerAndGetTransaction, cleanupInvalidTransactions, processPayment } from '../controller/transactionController';port express from 'express';
import { createTransaction, getAllTransactions, getTransactionById, getTransactionByUserId, updateTransactionStatus, deleteTransaction, getTransactionByVehicleId, checkUserIsWinnerAndGetTransaction, cleanupInvalidTransactions, processPayment } from '../controller/transactionController';
import { authenticateJWT } from '../middleware/auth';
const transactionRoutes = express.Router();

// 1. Get All Transactions
transactionRoutes.get('/getAllTransactions', authenticateJWT, getAllTransactions);
// 2. Get Transaction by ID
transactionRoutes.get('/:id/getTransaction', authenticateJWT, getTransactionById);
// 3. Get Transaction by User ID
transactionRoutes.get('/:user_id/getTransactionByUserId', authenticateJWT, getTransactionByUserId);
// 4. Create Transaction
transactionRoutes.post('/createTransaction', authenticateJWT, createTransaction);
// 5. Update Transaction Status
transactionRoutes.put('/:id/updateTransactionStatus', authenticateJWT, updateTransactionStatus);
// 6. Delete Transaction
transactionRoutes.delete('/:id/deleteTransaction', authenticateJWT, deleteTransaction);
// 7. Get Transaction by Vehicle ID
transactionRoutes.get('/:vehicle_id/getTransactionByVehicleId', authenticateJWT, getTransactionByVehicleId);
// 8. Check if user is winner and get transaction details
transactionRoutes.get('/auction/:auction_id/check-winner', authenticateJWT, checkUserIsWinnerAndGetTransaction);
// 9. Admin cleanup for invalid transactions
transactionRoutes.post('/admin/cleanup-invalid-transactions', authenticateJWT, cleanupInvalidTransactions);
// 10. Process payment for a transaction
transactionRoutes.post('/:id/process-payment', authenticateJWT, processPayment);

export default transactionRoutes;