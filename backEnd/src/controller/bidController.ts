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

        // Import the User model
        const { User } = require('../../models/user');

        const highestBid = await Bid.findOne({
            where: { auction_id },
            order: [['amount', 'DESC']],
            include: [{
                model: User,
                attributes: ['username', 'user_id']  // Only include needed fields
            }]
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
export const placeBid = async (req: AuthRequest, res: any) => {
    console.log("Place Bid Request:", req.body);
    try {
        
        const auction_id = req.params.auction_id;
        const { amount } = req.body;
        const {user_id} = req.body;
        const role = req.user?.role;
        
        // Prevent admins from placing bids
        if (role === 'admin') {
            return res.status(403).json({ message: "Admins are not allowed to place bids" });
        }
        
        console.log("Placing bid for auction:", auction_id, "with amount:", amount, "by user:", user_id);
        if (!auction_id || !amount || !user_id) {
            return res.status(400).json({ message: "Missing required fields: auction_id, amount, or user not authenticated" });
        }
        
        // Get auction details first
        const auction = await Auction.findOne({ where: { auction_id } });
        
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
          // Check if auction is already closed
        if (auction.status === 'closed') {
            return res.status(400).json({ message: "This auction is already closed. No more bids can be placed." });
        }

        // Get current highest bid to check if user is already the highest bidder
        const currentHighestBid = await Bid.findOne({
            where: { auction_id },
            order: [['amount', 'DESC']]
        });
        
        if (currentHighestBid && currentHighestBid.user_id === user_id) {
            return res.status(400).json({ 
                message: "You are already the highest bidder. No need to outbid yourself.",
                currentBid: currentHighestBid.amount
            });
        }
        
        // Check if auction end time has passed
        const now = new Date();
        const endDate = new Date(auction.endDate);
          if (now > endDate) {
            // Auction has ended, close it and determine winner
            auction.status = 'closed';
            
            // Find the highest bid
            const highestBid = await Bid.findOne({
                where: { auction_id },
                order: [['amount', 'DESC']]
            });
            
            if (highestBid) {
                // Update auction's current price to match the highest bid
                auction.currentPrice = highestBid.amount;
                await auction.save();
                
                // Create a transaction record for the winner
                await Transaction.create({
                    auction_id,
                    user_id: highestBid.user_id,
                    amount: highestBid.amount,
                    transactionDate: new Date(),
                    status: 'Pending',
                    paymentMethod: 'Not Selected'
                });
                
                return res.status(400).json({ 
                    message: "This auction has ended. The winner has been determined.", 
                    winner: highestBid.user_id === user_id,
                    winningBid: highestBid
                });
            } else {
                await auction.save();
                return res.status(400).json({ message: "This auction has ended with no bids." });
            }
        }
          // Calculate minimum bid increment (e.g., 5% of current price or at least 1,000,000)
        const minIncrement = Math.max(auction.currentPrice * 0.05, 1000000);
        const minAllowedBid = auction.currentPrice + minIncrement;
        
        // Check if bid meets minimum increment requirement
        if (amount < minAllowedBid) {
            return res.status(400).json({ 
                message: `Your bid must be at least ${minIncrement.toLocaleString()} above the current price.`,
                currentPrice: auction.currentPrice,
                minRequiredBid: minAllowedBid
            });
        }
        
        // Create a new bid
        const newBid = await Bid.create({
            auction_id,
            user_id,
            amount,
            bidTime: new Date()
        });
          // Update auction's current price
        if (amount > auction.currentPrice) {
            auction.currentPrice = amount;
            
            // Check if this is a last-minute bid (within 2 minutes of end time)
            const timeUntilEnd = endDate.getTime() - now.getTime();
            const TWO_MINUTES_MS = 2 * 60 * 1000;
            
            if (timeUntilEnd > 0 && timeUntilEnd <= TWO_MINUTES_MS) {
                // Extend auction by 2 more minutes
                auction.endDate = new Date(endDate.getTime() + TWO_MINUTES_MS);
                console.log(`Auction end time extended to ${auction.endDate} due to last-minute bid`);
            }
            
            await auction.save();
        }
        
        res.status(201).json({
            ...newBid.toJSON(),
            auctionEndDate: auction.endDate // Return updated end date if it was extended
        });
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

// Get all bids for an auction (bid history)
export const getBidHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const auction_id = req.params.auction_id;

        if (!auction_id) {
            res.status(400).json({ message: "auction_id parameter is required" });
            return;
        }

        // Import the User model
        const { User } = require('../../models/user');

        // Get all bids for this auction with user information
        const bids = await Bid.findAll({
            where: { auction_id },
            include: [{
                model: User,
                attributes: ['username', 'user_id']
            }],
            order: [['bidTime', 'DESC']] // Sort by bid time descending (newest first)
        });

        if (!bids || bids.length === 0) {
            res.status(404).json({ message: "No bids found for this auction" });
            return;
        }

        res.status(200).json(bids);
    } catch (error) {
        console.error("Error retrieving bid history:", error);
        res.status(500).json({ message: "Error retrieving bid history", error });
    }
};


