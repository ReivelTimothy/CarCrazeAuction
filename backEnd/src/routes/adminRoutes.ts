import express from 'express';
import { 
    getAllAdmins, 
    getAdminById, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin,
    getDashboardStats,
    getAllUsers,
    getAllTransactions,
    updateAuctionStatusByAdmin,
    deleteUser
} from '../controller/adminController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const adminRoutes = express.Router();

// Admin CRUD routes (require admin authentication)
adminRoutes.get('/admins', authenticateJWT, authorizeAdmin, getAllAdmins);
adminRoutes.get('/admins/:admin_id', authenticateJWT, authorizeAdmin, getAdminById);
adminRoutes.post('/admins', authenticateJWT, authorizeAdmin, createAdmin);
adminRoutes.put('/admins/:admin_id', authenticateJWT, authorizeAdmin, updateAdmin);
adminRoutes.delete('/admins/:admin_id', authenticateJWT, authorizeAdmin, deleteAdmin);

// Dashboard and statistics routes
adminRoutes.get('/dashboard/stats', authenticateJWT, authorizeAdmin, getDashboardStats);

// User management routes (admin functions)
adminRoutes.get('/users', authenticateJWT, authorizeAdmin, getAllUsers);
adminRoutes.delete('/users/:user_id', authenticateJWT, authorizeAdmin, deleteUser);

// Transaction management routes
adminRoutes.get('/transactions', authenticateJWT, authorizeAdmin, getAllTransactions);

// Auction management routes
adminRoutes.put('/auctions/:auction_id/status', authenticateJWT, authorizeAdmin, updateAuctionStatusByAdmin);

export default adminRoutes;