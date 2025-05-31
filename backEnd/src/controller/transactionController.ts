import { Transaction } from "../../models/transaction";
import { Auction } from "../../models/auction";
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';

// 1. get transaction by id
export const getTransactionById = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        
        if (!transactionId) {
            return sendValidationError(res, 'Transaction ID is required');
        }
        
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
        if (!transaction) {
            return sendNotFound(res, 'Transaction');
        }
        
        sendSuccess(res, transaction, 'Transaction retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving transaction', 500, error);
    }
};

// 2. get transaction by user_id
export const getTransactionByUserId = async (req: any, res: any) => {
    try {
        const userId = req.params.user_id;
        
        if (!userId) {
            return sendValidationError(res, 'User ID is required');
        }
        
        const transactions = await Transaction.findAll({ where: { user_id: userId } });
        if (!transactions || transactions.length === 0) {
            return sendNotFound(res, 'No transactions found for this user');
        }
        
        sendSuccess(res, transactions, 'Transactions retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving transactions', 500, error);
    }
};

// 3. create transaction
export const createTransaction = async (req: any, res: any) => {
    try {
        const { user_id, auction_id, amount, paymentMethod } = req.body;
        
        if (!user_id || !auction_id || !amount) {
            return sendValidationError(res, 'All fields are required: user_id, auction_id, amount');
        }
        
        const newTransaction = await Transaction.create({
            user_id,
            auction_id,
            amount,
            transactionDate: new Date(),
            paymentMethod: paymentMethod || 'Credit Card',
            status: "pending", // default status
        });
        
        sendSuccess(res, newTransaction, 'Transaction created successfully', 201);
    } catch (error) {
        sendError(res, 'Error creating transaction', 500, error);
    }
};

// 4. update transaction status
export const updateTransactionStatus = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        const { status } = req.body;
        
        if (!transactionId) {
            return sendValidationError(res, 'Transaction ID is required');
        }
        
        if (!status) {
            return sendValidationError(res, 'Status is required');
        }
        
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
        if (!transaction) {
            return sendNotFound(res, 'Transaction');
        }
        
        await transaction.update({ status });
        sendSuccess(res, transaction, 'Transaction status updated successfully');
    } catch (error) {
        sendError(res, 'Error updating transaction', 500, error);
    }
};

// 5. delete transaction
export const deleteTransaction = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        
        if (!transactionId) {
            return sendValidationError(res, 'Transaction ID is required');
        }
        
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
        if (!transaction) {
            return sendNotFound(res, 'Transaction');
        }
        
        await transaction.destroy();
        sendSuccess(res, null, 'Transaction deleted successfully');
    } catch (error) {        sendError(res, 'Error deleting transaction', 500, error);
    }
};
