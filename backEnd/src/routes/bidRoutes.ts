import express from "express";
import { getHighestBid, updateBidPrice } from "../controller/bidController";
const bidRoutes = express.Router();

// 1. Get Highest Bid
bidRoutes.get("/:vehicle_id/getHighestBid/", getHighestBid);
// 2. Update Bid Price
bidRoutes.put(":/vehicle_id/updateBidPrice/", updateBidPrice);


export default bidRoutes;