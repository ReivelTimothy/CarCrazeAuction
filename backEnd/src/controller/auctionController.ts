import { Auction } from "../../models/auction";

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


