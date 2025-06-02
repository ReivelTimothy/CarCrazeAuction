import express from 'express';
import { createAuction, getAllAuctions, getAuctionById, updateAuctionStatus } from '../controller/auctionController';
import { authenticateJWT } from '../middleware/auth';
import multer from 'multer';

const auctionRoutes = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 1 . Create Auction
auctionRoutes.post('/createAuction', upload.single('image'), authenticateJWT, createAuction);
// 2. Get all Auctions
auctionRoutes.get('/getAllAuctions', getAllAuctions);
// 3. Get Auction by ID
auctionRoutes.get('/:auction_id/getAuction', getAuctionById);
// 4. Update Auction status 
auctionRoutes.put('/:auction_id/updateAuctionStatus', authenticateJWT, updateAuctionStatus);
export default auctionRoutes;