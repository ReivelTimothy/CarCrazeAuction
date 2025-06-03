import { Transaction } from "../../models/transaction";
import { Auction } from "../../models/auction";
import { Bid } from "../../models/bid";

// 1. get all transactions
export const getAllTransactions = async (req: any, res: any) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error });
    }
};

// 2. get transaction by id
export const getTransactionById = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        
        // Import the User model
        const { User } = require('../../models/user');
        
        const transaction = await Transaction.findOne({ 
            where: { transaction_id: transactionId },
            include: [{
                model: User,
                attributes: ['username', 'user_id']  // Only include needed fields
            }]
        });
        
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transaction", error });
    }
};

// 3. get transaction by user_id
export const getTransactionByUserId = async (req: any, res: any) => {
    try {
        const userId = req.params.user_id;
        const transactions = await Transaction.findAll({ where: { user_id: userId } });
        if (!transactions) {
            return res.status(404).json({ message: "Transactions not found" });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error });
    }
};

// 4. create transaction
export const createTransaction = async (req: any, res: any) => {
    try {
        const { user_id, auction_id, amount, paymentMethod } = req.body;
        
        // Check if transaction already exists for this auction
        const existingTransaction = await Transaction.findOne({
            where: { auction_id }
        });
        
        if (existingTransaction) {
            return res.status(400).json({ 
                message: "A transaction already exists for this auction",
                transaction: existingTransaction
            });
        }
        
        const newTransaction = await Transaction.create({
            user_id,
            auction_id,
            amount,
            transactionDate: new Date(),
            paymentMethod: paymentMethod || 'Not Selected',
            status: "Pending" // default status
        });
        
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
    }
};

// 5. update transaction status
export const updateTransactionStatus = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        const { status } = req.body;
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await transaction.update({ status });
        res.status(200).json({message : "transaction status updated", transaction});
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
};

// 6. Clean up transactions for auctions with no valid bids
export const cleanupInvalidTransactions = async (req: any, res: any) => {
    try {
        const transactions = await Transaction.findAll({
            include: [{
                model: Auction,
                required: true
            }]
        });
        
        let cleanedUp = 0;
        let details = [];
        
        for (const transaction of transactions) {
            // Check if there's any bid for this auction
            const bid = await Bid.findOne({
                where: { auction_id: transaction.auction_id }
            });
            
            // If no bids exist but a transaction does, delete the transaction
            if (!bid) {
                details.push({
                    transaction_id: transaction.transaction_id,
                    auction_id: transaction.auction_id,
                    reason: 'No bids found for this auction'
                });
                
                await transaction.destroy();
                cleanedUp++;
            }
            // If bid amount doesn't match transaction amount, that's an issue
            else if (bid.amount !== transaction.amount) {
                details.push({
                    transaction_id: transaction.transaction_id,
                    auction_id: transaction.auction_id,
                    reason: `Bid amount (${bid.amount}) doesn't match transaction amount (${transaction.amount})`
                });
                
                // Update transaction to match bid amount
                await transaction.update({ amount: bid.amount });
                cleanedUp++;
            }
        }
        
        res.status(200).json({
            message: `Cleaned up ${cleanedUp} invalid transactions`,
            details
        });
    } catch (error) {
        console.error("Error cleaning up transactions:", error);
        res.status(500).json({ message: "Error cleaning up transactions", error });
    }
};

// 6. delete transaction
export const deleteTransaction = async (req: any, res: any) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        await transaction.destroy();
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
};

// 7. get transaction by vehicle_id
export const getTransactionByVehicleId = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.vehicle_id;
        const transactions = await Transaction.findAll({ where: { vehicle_id: vehicleId } });
        if (!transactions) {
            return res.status(404).json({ message: "Transactions not found" });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transactions", error });
    }
};

// 8. check if user is winner and get transaction details
export const checkUserIsWinnerAndGetTransaction = async (req: any, res: any) => {
    try {
        const auction_id = req.params.auction_id;
        const userId = req.user?.userId || req.body.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        
        // Check if auction exists and is closed
        const auction = await Auction.findOne({ 
            where: { auction_id }
        });
        
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        
        // If auction is not closed, check if it should be
        if (auction.status !== 'closed') {
            const now = new Date();
            const endDate = new Date(auction.endDate);
            
            if (now > endDate) {
                // Close the auction
                auction.status = 'closed';
                await auction.save();
            } else {
                return res.status(200).json({ 
                    isWinner: false,
                    message: "Auction is still active",
                    auction
                });
            }
        }
          // Get the transaction for this auction with user information
        const { User } = require('../../models/user');
        
        const transaction = await Transaction.findOne({
            where: { auction_id },
            include: [{
                model: User,
                attributes: ['username', 'user_id']
            }]
        });
          if (!transaction) {
            // No transaction found, check for highest bid
            const highestBid = await Bid.findOne({
                where: { auction_id },
                order: [['amount', 'DESC']],
                include: [{
                    model: User,
                    attributes: ['username', 'user_id']
                }]
            });
            
            if (highestBid && highestBid.user_id === userId) {
                // User is winner but transaction not created yet
                const newTransaction = await Transaction.create({
                    auction_id,
                    user_id: userId,
                    amount: highestBid.amount,
                    transactionDate: new Date(),
                    status: 'Pending',
                    paymentMethod: 'Not Selected'
                });
                
                return res.status(200).json({
                    isWinner: true,
                    transaction: newTransaction,
                    message: "You are the winner! Please complete the transaction."
                });
            } else if (highestBid) {
                // User is not the winner
                return res.status(200).json({
                    isWinner: false,
                    message: "You are not the winner of this auction."
                });
            } else {
                return res.status(200).json({
                    isWinner: false,
                    message: "No bids were placed on this auction."
                });
            }
        } else {
            // Transaction exists, check if user is the winner
            const isWinner = transaction.user_id === userId;
            
            return res.status(200).json({
                isWinner,
                transaction: isWinner ? transaction : undefined,
                message: isWinner 
                    ? "You are the winner! Please complete the transaction." 
                    : "You are not the winner of this auction."
            });
        }
    } catch (error) {
        console.error("Error checking winner status:", error);
        res.status(500).json({ message: "Error checking winner status", error });
    }
};
