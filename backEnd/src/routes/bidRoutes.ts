import express from "express";
import { getHighestBid, updateBidPrice, placeBid, getUserParticipatedAuctions, getUserWonAuctions } from "../controller/bidController";
import { authenticateJWT } from '../middleware/auth';
const bidRoutes = express.Router();

// 1. Get Highest Bid
bidRoutes.get("/:auction_id/getHighestBid", getHighestBid);
// 2. Update Bid Price
bidRoutes.put("/:auction_id/updateBidPrice", authenticateJWT, updateBidPrice);
// 3. Place Bid
bidRoutes.post("/:auction_id/placeBid", authenticateJWT, placeBid);
// 4. Get User Participated Auctions
bidRoutes.get("/user/participated", authenticateJWT, getUserParticipatedAuctions);
// 5. Get User Won Auctions
bidRoutes.get("/user/won", authenticateJWT, getUserWonAuctions);

export default bidRoutes;