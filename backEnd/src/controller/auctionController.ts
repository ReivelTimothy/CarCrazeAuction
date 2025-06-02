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
        }
        auction.status = status;
        await auction.save();
        res.status(200).json(auction);
    } catch (error) {
        console.error("Error updating auction status:", error);
        res.status(500).json({ message: "Error updating auction status", error });
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
        });

        // Format active auctions with bid counts
        const activeAuctionsWithBids = activeAuctionsData.map(auction => ({
            auction_id: auction.auction_id,
            title: auction.title,
            currentPrice: auction.currentPrice,
            endDate: auction.endDate,
            bidCount: auction.bids ? auction.bids.length : 0
        }));

        res.status(200).json({
            totalAuctions,
            activeAuctions,
            totalRevenue: totalRevenue || 0,
            totalBids,
            recentAuctions,
            activeAuctionsWithBids
        });
    } catch (error) {
        console.error("Error getting admin statistics:", error);
        res.status(500).json({ message: "Error getting admin statistics", error });
    }
};


