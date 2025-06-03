import express from 'express';
import { createAuction, updateAuctionStatus, getAdminStatistics } from '../controller/auctionController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { checkDatabaseIntegrity, fixDatabaseIntegrity } from '../controller/databaseIntegrityController';
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
// 3. Get Admin Statistics (Admin only)
adminRoutes.get('/statistics', authenticateJWT, authorizeAdmin, getAdminStatistics);
// 4. Check Database Integrity (Admin only)
adminRoutes.get('/database/check-integrity', authenticateJWT, authorizeAdmin, checkDatabaseIntegrity);
// 5. Fix Database Integrity (Admin only)
adminRoutes.post('/database/fix-integrity', authenticateJWT, authorizeAdmin, fixDatabaseIntegrity);

export default adminRoutes;