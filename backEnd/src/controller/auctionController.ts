import { Auction } from "../../models/auction";
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';

// 1. Create Auction
export const createAuction = async (req: any, res: any) => {
    try {
        const { vehicle_id, title, description, startingPrice, status, category } = req.body;
        
        // Validate required fields
        if (!vehicle_id || !title || !description || !startingPrice || !status || !category) {
            return sendValidationError(res, 'Missing required fields');
        }

        const image = req.file ? req.file.filename : null;

        const auction = await Auction.create({
            vehicle_id,
            title,
            description,
            startingPrice,
            currentPrice: startingPrice, 
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            status,
            category,
            image
        });        return sendSuccess(res, auction, 'Auction created successfully', 201);
    } catch (error) {
        sendError(res, 'Error creating auction', 500, error);
    }
};

// 2. Get all Auctions
export const getAllAuctions = async (req: any, res: any) => {
    try {
        const auctions = await Auction.findAll();
        sendSuccess(res, auctions, 'Auctions retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving auctions', 500, error);
    }
};

// 3. Get Auction by ID
export const getAuctionById = async (req: any, res: any) => {
    try {
        const auctionId = req.params.auction_id;
        
        if (!auctionId) {
            return sendValidationError(res, 'Auction ID is required');
        }
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return sendNotFound(res, 'Auction');
        }
        
        sendSuccess(res, auction, 'Auction retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving auction', 500, error);
    }
};

// 4. Update Auction status
export const updateAuctionStatus = async (req: any, res: any) => {
    try {
        const auctionId = req.params.auction_id;
        const { status } = req.body;
        
        if (!auctionId) {
            return sendValidationError(res, 'Auction ID is required');
        }
        
        if (!status) {
            return sendValidationError(res, 'Status is required');
        }
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return sendNotFound(res, 'Auction');
        }
        
        auction.status = status;
        await auction.save();
        
        sendSuccess(res, auction, 'Auction status updated successfully');
    } catch (error) {
        sendError(res, 'Error updating auction status', 500, error);
    }
};


