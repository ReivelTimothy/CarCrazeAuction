import express from 'express';
import { createAuction, getAllAuctions, getAuctionById, updateAuctionStatus } from '../controller/auctionController';

const auctionRoutes = express.Router();

// 1 . Create Auction
auctionRoutes.post('/createAuction', /*authenticateJWT,*/ createAuction);
// 2. Get all Auctions
auctionRoutes.get('/getAllAuctions', /*authenticateJWT,*/ getAllAuctions);
// 3. Get Auction by ID
auctionRoutes.get('/:auction_id/getAuction', /*authenticateJWT,*/ getAuctionById);
// 4. Update Auction status 
auctionRoutes.put('/:auction_id/updateAuctionStatus', /*authenticateJWT,*/ updateAuctionStatus);
export default auctionRoutes;