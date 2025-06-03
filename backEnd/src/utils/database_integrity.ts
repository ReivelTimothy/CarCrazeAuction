// This utility file can be used for data integrity checks and database maintenance

import { User } from '../../models/user';
import { Auction } from '../../models/auction';
import { Bid } from '../../models/bid';
import { Transaction } from '../../models/transaction';
import { Vehicle } from '../../models/vehicle';

/**
 * Checks for transactions with missing references
 * @returns Object with counts of inconsistent data
 */
export const checkDataIntegrity = async () => {
    const results = {
        transactions: {
            total: 0,
            missingUser: 0,
            missingAuction: 0,
            fixed: 0
        },
        bids: {
            total: 0,
            missingUser: 0,
            missingAuction: 0,
            fixed: 0
        },
        auctions: {
            total: 0,
            missingVehicle: 0,
            fixed: 0
        }
    };

    // Check transactions
    const transactions = await Transaction.findAll();
    results.transactions.total = transactions.length;
    
    for (const transaction of transactions) {
        const user = await User.findOne({ where: { user_id: transaction.user_id } });
        const auction = await Auction.findOne({ where: { auction_id: transaction.auction_id } });
        
        if (!user) results.transactions.missingUser++;
        if (!auction) results.transactions.missingAuction++;
    }

    // Check bids
    const bids = await Bid.findAll();
    results.bids.total = bids.length;
    
    for (const bid of bids) {
        const user = await User.findOne({ where: { user_id: bid.user_id } });
        const auction = await Auction.findOne({ where: { auction_id: bid.auction_id } });
        
        if (!user) results.bids.missingUser++;
        if (!auction) results.bids.missingAuction++;
    }

    // Check auctions
    const auctions = await Auction.findAll();
    results.auctions.total = auctions.length;
    
    for (const auction of auctions) {
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: auction.vehicle_id } });
        
        if (!vehicle) results.auctions.missingVehicle++;
    }

    return results;
};

/**
 * Fix data integrity issues by removing invalid records
 * @returns Object with counts of fixed inconsistencies
 */
export const fixDataIntegrity = async () => {
    const results = {
        transactions: 0,
        bids: 0,
        auctions: 0
    };

    // Fix transactions
    const transactions = await Transaction.findAll();
    for (const transaction of transactions) {
        const user = await User.findOne({ where: { user_id: transaction.user_id } });
        const auction = await Auction.findOne({ where: { auction_id: transaction.auction_id } });
        
        if (!user || !auction) {
            await transaction.destroy();
            results.transactions++;
        }
    }

    // Fix bids
    const bids = await Bid.findAll();
    for (const bid of bids) {
        const user = await User.findOne({ where: { user_id: bid.user_id } });
        const auction = await Auction.findOne({ where: { auction_id: bid.auction_id } });
        
        if (!user || !auction) {
            await bid.destroy();
            results.bids++;
        }
    }

    // Fix auctions
    const auctions = await Auction.findAll();
    for (const auction of auctions) {
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: auction.vehicle_id } });
        
        if (!vehicle) {
            await auction.destroy();
            results.auctions++;
        }
    }

    return results;
};
