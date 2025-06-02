import express from "express";
import { getHighestBid, updateBidPrice, placeBid } from "../controller/bidController";
import { authenticateJWT } from '../middleware/auth';
const bidRoutes = express.Router();

// 1. Get Highest Bid
bidRoutes.get("/:auction_id/getHighestBid", getHighestBid);
// 2. Update Bid Price
bidRoutes.put("/:auction_id/updateBidPrice", authenticateJWT, updateBidPrice);
// 3. Place Bid
bidRoutes.post("/:auction_id/placeBid", authenticateJWT, placeBid);


export default bidRoutes;