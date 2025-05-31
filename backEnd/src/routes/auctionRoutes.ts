import express from 'express';
import { createAuction, getAllAuctions, getAuctionById, updateAuctionStatus } from '../controller/auctionController';
import { authenticateJWT } from '../middleware/auth';
import multer from 'multer';

const auctionRoutes = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes with proper authentication where needed
auctionRoutes.post('/createAuction', upload.single('image'), authenticateJWT, createAuction);
auctionRoutes.get('/getAllAuctions', getAllAuctions);
auctionRoutes.get('/:auction_id/getAuction', getAuctionById);
auctionRoutes.put('/:auction_id/updateAuctionStatus', authenticateJWT, updateAuctionStatus);
export default auctionRoutes;