import { Auction } from "../../models/auction";
import { Bid } from "../../models/bid";
import { Transaction } from "../../models/transaction";
import { Op } from 'sequelize';

/**
 * Checks for expired auctions and processes them
 * This function should be called from a scheduled task or cron job
 */
export const checkExpiredAuctions = async (req: any, res: any) => {
    try {
        const now = new Date();
          // Find all open auctions that have ended
        // Support both status formats: 'OPEN' (as in UI) and 'active' (as in admin API)
        const expiredAuctions = await Auction.findAll({
            where: {
                status: {
                    [Op.or]: ['OPEN', 'active'] // Handle both status formats
                },
                endDate: {
                    [Op.lt]: now
                }
            }
        });
        
        console.log(`Found ${expiredAuctions.length} expired auctions to process`);
          interface AuctionResult {
            auction_id: string;
            title: string;
            winner?: string;
            amount?: number;
            status?: string;
            error?: string;
        }
        
        const results = {
            processed: 0,
            withWinners: 0,
            withoutBids: 0,
            errors: 0,
            details: [] as AuctionResult[]
        };
        
        // Process each expired auction
        for (const auction of expiredAuctions) {
            try {
                // Update auction status to closed
                auction.status = 'closed';
                
                // Find the highest bid for this auction
                const highestBid = await Bid.findOne({
                    where: { auction_id: auction.auction_id },
                    order: [['amount', 'DESC']]
                });
                
                if (highestBid) {
                    // Update auction's current price to match the highest bid
                    auction.currentPrice = highestBid.amount;
                    
                    // Check if a transaction already exists for this auction
                    const existingTransaction = await Transaction.findOne({
                        where: { auction_id: auction.auction_id }
                    });
                    
                    if (!existingTransaction) {
                        // Create a transaction record for the winner
                        await Transaction.create({
                            auction_id: auction.auction_id,
                            user_id: highestBid.user_id,
                            amount: highestBid.amount,
                            transactionDate: new Date(),
                            status: 'Pending',
                            paymentMethod: 'Not Selected'
                        });
                    }
                    
                    results.withWinners++;
                    results.details.push({
                        auction_id: auction.auction_id,
                        title: auction.title,
                        winner: highestBid.user_id,
                        amount: highestBid.amount
                    });
                } else {
                    results.withoutBids++;
                    results.details.push({
                        auction_id: auction.auction_id,
                        title: auction.title,
                        status: 'No bids'
                    });
                }
                
                // Save the updated auction
                await auction.save();
                results.processed++;            } catch (auctionError: any) {
                console.error(`Error processing auction ${auction.auction_id}:`, auctionError);
                results.errors++;
                results.details.push({
                    auction_id: auction.auction_id,
                    title: auction.title,
                    error: auctionError.message || 'Unknown error occurred'
                });
            }
        }
        
        res.status(200).json({
            message: 'Expired auctions processed successfully',
            auctions_processed: results.processed,
            auctions_with_winners: results.withWinners,
            auctions_without_bids: results.withoutBids,
            errors: results.errors,
            details: results.details
        });    } catch (error: any) {
        console.error("Error checking expired auctions:", error);
        res.status(500).json({ 
            message: "Error checking expired auctions", 
            error: error.message || 'Unknown error occurred'
        });
    }
};
