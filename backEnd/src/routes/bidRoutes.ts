import express from "express";
import { getHighestBid, updateBidPrice, placeBid } from "../controller/bidController";
import { authenticateJWT } from '../middleware/auth';

const bidRoutes = express.Router();

// Bid routes with appropriate authentication
bidRoutes.get("/:auction_id/getHighestBid", getHighestBid);
bidRoutes.put("/:auction_id/updateBidPrice", authenticateJWT, updateBidPrice);
bidRoutes.post("/:auction_id/placeBid", authenticateJWT, placeBid);


export default bidRoutes;