import express from 'express';
import { createAuction, updateAuctionStatus } from '../controller/auctionController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import multer from 'multer';

const adminRoutes = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Admin-only auction management routes
// 1. Create Auction (Admin only)
adminRoutes.post('/createAuction', upload.single('image'), authenticateJWT, authorizeAdmin, createAuction);
// 2. Update Auction status (Admin only)
adminRoutes.put('/:auction_id/updateAuctionStatus', authenticateJWT, authorizeAdmin, updateAuctionStatus);

export default adminRoutes;