import { Bid } from '../../models/bid';
import { Auction } from '../../models/auction';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';

// 1. get highest bid from a vehicle
export const getHighestBid = async (req: any, res: any) => {
    try {
        const auction_id = req.params.auction_id;
        if (!auction_id) {
            return sendValidationError(res, "auction_id parameter is required");
        }

        const highestBid = await Bid.findOne({
            where: { auction_id },
            order: [['amount', 'DESC']],
        });        if (!highestBid) {
            return sendNotFound(res, "No bids found for this auction");
        }
        
        sendSuccess(res, highestBid, 'Highest bid retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving highest bid', 500, error);
    }
};

// 2. update bid price with user_id and auction_id
export const updateBidPrice = async (req: any, res: any) => {
    try {
        const auction_id = req.params.auction_id;
        const { amount, user_id } = req.body;
        
        if (!user_id || !auction_id || !amount) {
            return sendValidationError(res, "Missing required fields: user_id, auction_id, or amount");
        }
        
        const bid = await Bid.findOne({ where: { user_id, auction_id } });
        if (!bid) {
            return sendNotFound(res, "Bid");
        }
        
        bid.amount = amount;
        await bid.save();
        
        sendSuccess(res, bid, 'Bid updated successfully');
    } catch (error) {
        sendError(res, 'Error updating bid', 500, error);
    }
}

// 3. Place a new bid
export const placeBid = async (req: any, res: any) => {
    try {
        const auction_id = req.params.auction_id;
        const { amount, user_id } = req.body;
        
        if (!auction_id || !amount || !user_id) {
            return sendValidationError(res, "Missing required fields: auction_id, amount, or user_id");
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
            await auction.save();        }
        
        sendSuccess(res, newBid, 'Bid placed successfully', 201);
    } catch (error) {
        sendError(res, 'Error placing bid', 500, error);
    }
}


