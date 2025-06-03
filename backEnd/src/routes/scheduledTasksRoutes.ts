import express from 'express';
import { checkExpiredAuctions } from '../controller/scheduledTasksController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Secure endpoint for scheduled tasks - requires authentication
router.get('/check-expired-auctions', authenticateJWT, authorizeAdmin, checkExpiredAuctions);

// Unsecured endpoint for scheduled tasks (if you prefer to use API key in the query string instead)
// Add an API key check middleware if you uncomment this
// router.get('/check-expired-auctions-cron', checkExpiredAuctions);

export default router;
