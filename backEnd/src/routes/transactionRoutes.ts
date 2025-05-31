import express from 'express';
import { createTransaction, getTransactionById, getTransactionByUserId, updateTransactionStatus, deleteTransaction } from '../controller/transactionController';
import { authenticateJWT } from '../middleware/auth';

const transactionRoutes = express.Router();

// Transaction routes with appropriate authentication
transactionRoutes.get('/:id/getTransaction', authenticateJWT, getTransactionById);
transactionRoutes.get('/:user_id/getTransactionByUserId', authenticateJWT, getTransactionByUserId);
transactionRoutes.post('/createTransaction', authenticateJWT, createTransaction);
transactionRoutes.put('/:id/updateTransactionStatus', authenticateJWT, updateTransactionStatus);
transactionRoutes.delete('/:id/deleteTransaction', authenticateJWT, deleteTransaction);

export default transactionRoutes;