import { Transaction } from "../../models/transaction";

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
        const transaction = await Transaction.findOne({ where: { transaction_id: transactionId } });
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
        const { user_id, vehicle_id, amount} = req.body;
        const newTransaction = await Transaction.create({
            user_id,
            vehicle_id,
            amount,
            status : "pending", // default status
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
