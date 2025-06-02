import {Bid} from '../../models/bid';
import {Auction} from '../../models/auction';
import {Vehicle} from '../../models/vehicle';
import {Transaction} from '../../models/transaction';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: 'user' | 'admin';
    };
}

// 1. get highest bid from a vehicle
export const getHighestBid = async (req: any, res: any) => {
    try {
        const auction_id = req.params.auction_id;
        if (!auction_id) {
            return res.status(400).json({ message: "auction_id parameter is required" });
        }

        const highestBid = await Bid.findOne({
            where: { auction_id },
            order: [['amount', 'DESC']],
        });

        if (!highestBid) {
            return res.status(404).json({ message: "No bids found for this auction" });
        }
        res.status(200).json(highestBid);
    } catch (error) {
        console.error("Error retrieving highest bid:", error);
        res.status(500).json({ message: "Error retrieving highest bid", error });
    }
};

// 2. update bid price with user_id and vehicle_id
export const updateBidPrice = async (req: any, res: any) => {
    try {
        const {vehicle_id, amount} = req.body;
        const userId = req.body.userId;
        const bid = await Bid.findOne({ where: { userId, vehicle_id } });
        if (!bid) {
            return res.status(404).json({ message: "Bid not found" });
        }
        bid.amount = amount;
        await bid.save();
        res.status(200).json(bid);
    } catch (error) {
        res.status(500).json({ message: "Error updating bid", error });
    }
}

// 3. Place a new bid
export const placeBid = async (req: any, res: any) => {
    console.log("Place Bid Request:", req.body);
    try {
        
        const auction_id = req.params.auction_id;
        const { amount } = req.body;
        const {user_id} = req.body;
        console.log("Placing bid for auction:", auction_id, "with amount:", amount, "by user:", user_id);
        if (!auction_id || !amount || !user_id) {
            return res.status(400).json({ message: "Missing required fields: auction_id, amount, or user not authenticated" });
        }
        
        // Create a new bid
        const newBid = await Bid.create({
            auction_id,
            user_id,
            amount,
            bidTime: new Date()
        });
        
        // Update auction's current price
        const auction = await Auction.findOne({ where: { auction_id } });
        if (auction && amount > auction.currentPrice) {
            auction.currentPrice = amount;
            await auction.save();
        }
        
        res.status(201).json(newBid);
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ message: "Error placing bid", error });
    }
}

// Get auctions user participated in (placed bids)
export const getUserParticipatedAuctions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        // Simplified query without GROUP BY        // First get unique auction IDs where user has placed bids
        const userBids = await Bid.findAll({
            where: { user_id: userId },
            attributes: ['auction_id'],
            group: ['auction_id']
        });
        
        const auctionIds = userBids.map(bid => bid.auction_id);
        
        // Then fetch those auctions with vehicle details
        const participatedAuctions = await Auction.findAll({
            where: {
                auction_id: auctionIds
            },
            include: [
                {
                    model: Vehicle,
                    required: true
                }
            ],
            order: [['startDate', 'DESC']]
        });

        res.status(200).json(participatedAuctions);
    } catch (error) {
        console.error("Error getting participated auctions:", error);
        res.status(500).json({ message: "Error getting participated auctions", error });
    }
};

// Get auctions user won
export const getUserWonAuctions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }        // First get unique auction IDs where user has won
        const userTransactions = await Transaction.findAll({
            where: { user_id: userId },
            attributes: ['auction_id'],
            group: ['auction_id']
        });
        
        const wonAuctionIds = userTransactions.map(transaction => transaction.auction_id);
        
        // Then fetch those auctions with vehicle details
        const wonAuctions = await Auction.findAll({
            where: {
                auction_id: wonAuctionIds
            },
            include: [
                {
                    model: Vehicle,
                    required: true
                }
            ],
            order: [['startDate', 'DESC']]
        });

        res.status(200).json(wonAuctions);
    } catch (error) {
        console.error("Error getting won auctions:", error);
        res.status(500).json({ message: "Error getting won auctions", error });
    }
};


