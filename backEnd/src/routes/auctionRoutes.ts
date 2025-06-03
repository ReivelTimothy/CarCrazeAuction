import express from 'express';
import { getAllAuctions, getAuctionById, checkAuctionEndAndDetermineWinner } from '../controller/auctionController';

const auctionRoutes = express.Router();

// User-accessible auction routes (read-only)
// 1. Get all Auctions (public access)
auctionRoutes.get('/getAllAuctions', getAllAuctions);
// 2. Get Auction by ID (public access)
auctionRoutes.get('/:auction_id/getAuction', getAuctionById);
// 3. Check auction end and determine winner (public access)
auctionRoutes.get('/:auction_id/check-end', checkAuctionEndAndDetermineWinner);

export default auctionRoutes;