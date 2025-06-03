import { Auction } from "../../models/auction";
import { Bid } from "../../models/bid";
import { Transaction } from "../../models/transaction";
import { Vehicle } from "../../models/vehicle";
import { Sequelize } from "sequelize-typescript";

// 1. Create Auction
export const createAuction = async (req: any, res: any) => {
    try {
        const { vehicle_id, title, description, startingPrice, status, category } = req.body;
        const image = req.file ? req.file.filename : null; // Save only filename or use req.file.path for full path

        const auction = await Auction.create({
            vehicle_id,
            title,
            description,
            startingPrice,
            currentPrice: startingPrice, 
            startDate : new Date(),
            endDate : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            status,
            category,
            image // Save image filename/path
        });
        res.status(201).json(auction);
    } catch (error) {
        console.error("Error creating auction:", error);
        res.status(500).json({ message: "Error creating auction", error });
    }
};

// 2. Get all Auctions
export const getAllAuctions = async (req: any, res: any) => {
    try {
        const auctions = await Auction.findAll();
        res.status(200).json(auctions);
    } catch (error) {
        console.error("Error retrieving auctions:", error);
        res.status(500).json({ message: "Error retrieving auctions", error });
    }
};

// 3. Get Auction by ID
export const getAuctionById = async (req: any, res: any) => {
    try {
        // Use auction_id from params to match the route parameter name
        const auctionId = req.params.auction_id;
        
        console.log("Fetching auction with ID:", auctionId);
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        res.status(200).json(auction);
    } catch (error) {
        console.error("Error retrieving auction:", error);
        res.status(500).json({ message: "Error retrieving auction", error });
    }
};
// 4. Update Auction status
export const updateAuctionStatus = async (req: any, res: any) => {
    try {
        // Use auction_id from params to match the route parameter name
        const auctionId = req.params.auction_id;
        const { status } = req.body;
        
        console.log("Updating auction status for ID:", auctionId, "to:", status);
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }        console.log("Current auction status:", auction.status, "New status:", status);
        
        // Normalize status to correct database format
        let normalizedStatus = status;
        if (status.toLowerCase() === 'active') {
            normalizedStatus = 'OPEN';
        }
        
        // Update auction status
        auction.status = normalizedStatus;
        await auction.save();
        
        // If status changed to "closed", handle the winner determination
        if (status === 'closed' || status.toLowerCase() === 'closed') {
            // Find the highest bid
            const highestBid = await Bid.findOne({
                where: { auction_id: auctionId },
                order: [['amount', 'DESC']]
            });
            
            if (highestBid) {
                // Update auction's current price to match the highest bid
                auction.currentPrice = highestBid.amount;
                await auction.save();
                
                // Check if a transaction already exists for this auction
                const existingTransaction = await Transaction.findOne({
                    where: { auction_id: auctionId }
                });
                
                if (!existingTransaction) {
                    // Create a transaction record for the winner
                    await Transaction.create({
                        auction_id: auctionId,
                        user_id: highestBid.user_id,
                        amount: highestBid.amount,
                        transactionDate: new Date(),
                        status: 'Pending',
                        paymentMethod: 'Not Selected'
                    });
                }
            }
        }
        
        res.status(200).json(auction);
    } catch (error) {
        console.error("Error updating auction status:", error);
        res.status(500).json({ message: "Error updating auction status", error });
    }
};

// 6. Check auction end and determine winner
export const checkAuctionEndAndDetermineWinner = async (req: any, res: any) => {
    try {
        const auctionId = req.params.auction_id;
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        
        // Check if auction is already closed
        if (auction.status === 'closed') {
            // Find the winning transaction
            const winningTransaction = await Transaction.findOne({ 
                where: { auction_id: auctionId } 
            });
            
            if (winningTransaction) {
                return res.status(200).json({ 
                    message: "This auction is already closed", 
                    winner: true,
                    winnerId: winningTransaction.user_id,
                    winningAmount: winningTransaction.amount,
                    transactionId: winningTransaction.transaction_id,
                    transactionStatus: winningTransaction.status
                });
            } else {
                return res.status(200).json({ 
                    message: "This auction is already closed with no winner", 
                    winner: false
                });
            }
        }
        
        // Check if auction end time has passed
        const now = new Date();
        const endDate = new Date(auction.endDate);
          if (now > endDate) {
            // Auction has ended, close it and determine winner
            auction.status = 'closed';
              
            // Import the User model
            const { User } = require('../../models/user');
            
            // Find the highest bid
            const highestBid = await Bid.findOne({
                where: { auction_id: auctionId },
                order: [['amount', 'DESC']],
                include: [{
                    model: User,
                    attributes: ['username', 'user_id']  // Include username
                }]
            });
            
            if (highestBid) {
                // Update auction's current price to match the highest bid
                auction.currentPrice = highestBid.amount;
                await auction.save();
                
                // Check if a transaction already exists for this auction
                const existingTransaction = await Transaction.findOne({
                    where: { auction_id: auctionId }
                });
                
                if (!existingTransaction) {
                    // Create a transaction record for the winner
                    const transaction = await Transaction.create({
                        auction_id: auctionId,
                        user_id: highestBid.user_id,
                        amount: highestBid.amount,
                        transactionDate: new Date(),
                        status: 'Pending',
                        paymentMethod: 'Not Selected'
                    });
                      return res.status(200).json({ 
                        message: "Auction has ended. A winner has been determined.", 
                        winner: true,
                        winnerId: highestBid.user_id,
                        winnerName: highestBid.user?.username || null,
                        winningAmount: highestBid.amount,
                        transactionId: transaction.transaction_id,
                        transactionStatus: 'Pending'
                    });
                } else {
                    return res.status(200).json({ 
                        message: "Auction has already been processed with a winner.", 
                        winner: true,
                        winnerId: existingTransaction.user_id,
                        winningAmount: existingTransaction.amount,
                        transactionId: existingTransaction.transaction_id,
                        transactionStatus: existingTransaction.status
                    });
                }
            } else {
                return res.status(200).json({ 
                    message: "Auction has ended with no bids.",
                    winner: false
                });
            }
        } else {
            // Auction is still active
            return res.status(200).json({
                message: "Auction is still active",
                status: auction.status,
                timeRemaining: endDate.getTime() - now.getTime(),
                endDate: endDate
            });
        }
    } catch (error) {
        console.error("Error checking auction end:", error);
        res.status(500).json({ message: "Error checking auction end", error });
    }
};

// 5. Get Admin Dashboard Statistics
export const getAdminStatistics = async (req: any, res: any) => {
    try {
        // Total auctions count
        const totalAuctions = await Auction.count();

        // Active auctions count
        const activeAuctions = await Auction.count({
            where: { status: 'OPEN' }
        });

        // Total revenue from completed transactions
        const totalRevenue = await Transaction.sum('amount', {
            where: { status: 'Completed' }
        });

        // Total bids count
        const totalBids = await Bid.count();        // Recent auctions (last 5)
        const recentAuctions = await Auction.findAll({
            include: [
                {
                    model: Vehicle,
                    required: true
                }
            ],
            order: [['startDate', 'DESC']],
            limit: 5
        });        // Active auctions with bid counts
        const activeAuctionsData = await Auction.findAll({
            where: { status: 'OPEN' },
            include: [
                {
                    model: Bid,
                    required: false
                }
            ],
            order: [['startDate', 'DESC']]
        });        // Format active auctions with bid counts
        const activeAuctionsWithBids = activeAuctionsData.map(auction => ({
            auction_id: auction.auction_id,
            title: auction.title,
            currentPrice: auction.currentPrice,
            endDate: auction.endDate,
            bidCount: auction.bids ? auction.bids.length : 0
        }));        // Get recent bids with auction title and user info
        const { User } = require('../../models/user');
        
        const recentBids = await Bid.findAll({
            attributes: ['bid_id', 'user_id', 'auction_id', 'amount', 'bidTime'],
            include: [
                {
                    model: Auction,
                    attributes: ['title'],
                    required: true
                },
                {
                    model: User,
                    attributes: ['username', 'user_id'],
                    required: true
                }
            ],
            order: [['bidTime', 'DESC']],
            limit: 10
        });
          // Format recent bids
        const formattedRecentBids = recentBids.map(bid => {
            // Handle potential serialization issues by accessing raw values
            const plainBid = bid.get({ plain: true });
            return {
                bid_id: plainBid.bid_id,
                user_id: plainBid.user_id,
                auction_id: plainBid.auction_id,
                auction_title: plainBid.auction ? plainBid.auction.title : 'Unknown Auction',
                amount: plainBid.amount,
                bidTime: plainBid.bidTime,
                user: plainBid.user ? {
                    username: plainBid.user.username,
                    user_id: plainBid.user.user_id
                } : null
            };
        });

        res.status(200).json({
            totalAuctions,
            activeAuctions,
            totalRevenue: totalRevenue || 0,
            totalBids,
            recentAuctions,
            activeAuctionsWithBids,
            recentBids: formattedRecentBids
        });
    } catch (error) {
        console.error("Error getting admin statistics:", error);
        res.status(500).json({ message: "Error getting admin statistics", error });
    }
};


