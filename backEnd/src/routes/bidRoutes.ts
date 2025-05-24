import express from "express";
import { getHighestBid, updateBidPrice, placeBid } from "../controller/bidController";
const bidRoutes = express.Router();

// 1. Get Highest Bid
bidRoutes.get("/:auction_id/getHighestBid", getHighestBid);
// 2. Update Bid Price
bidRoutes.put("/:auction_id/updateBidPrice", updateBidPrice);
// 3. Place Bid
bidRoutes.post("/:auction_id/placeBid", placeBid);


export default bidRoutes;