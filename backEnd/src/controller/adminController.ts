import { v4 as uuidv4 } from 'uuid';
import { Admin } from '../../models/admin';
import { Transaction } from '../../models/transaction';
import { Vehicle } from '../../models/vehicle';
import { Auction } from '../../models/auction';
import { User } from '../../models/user';
import { Bid } from '../../models/bid';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';

// 1. Get all admins
export const getAllAdmins = async (req: any, res: any) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password'] } // Don't return passwords
        });
        sendSuccess(res, admins, 'Admins retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving admins', 500, error);
    }
};

// 2. Get admin by ID
export const getAdminById = async (req: any, res: any) => {
    try {
        const adminId = req.params.admin_id;
        
        if (!adminId) {
            return sendValidationError(res, 'Admin ID is required');
        }
        
        const admin = await Admin.findOne({ 
            where: { admin_id: adminId },
            attributes: { exclude: ['password'] }
        });
        
        if (!admin) {
            return sendNotFound(res, 'Admin');
        }
        
        sendSuccess(res, admin, 'Admin retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving admin', 500, error);
    }
};

// 3. Create new admin
export const createAdmin = async (req: any, res: any) => {
    try {
        const { username, email, password, phoneNum } = req.body;
        
        if (!username || !email || !password || !phoneNum) {
            return sendValidationError(res, 'Username, email, password, and phoneNum are required');
        }
        
        // Check if admin with same email already exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return sendValidationError(res, 'Admin with this email already exists');
        }
        
        const admin = await Admin.create({
            admin_id: uuidv4(),
            username,
            email,
            password, // In production, hash this password
            phoneNum
        });
        
        // Return without password
        const { password: _, ...adminData } = admin.toJSON();
        sendSuccess(res, adminData, 'Admin created successfully', 201);
    } catch (error) {
        sendError(res, 'Error creating admin', 500, error);
    }
};

// 4. Update admin
export const updateAdmin = async (req: any, res: any) => {
    try {
        const adminId = req.params.admin_id;
        const { username, email, phoneNum } = req.body;
        
        if (!adminId) {
            return sendValidationError(res, 'Admin ID is required');
        }
        
        const admin = await Admin.findOne({ where: { admin_id: adminId } });
        if (!admin) {
            return sendNotFound(res, 'Admin');
        }
        
        // Update fields if provided
        if (username) admin.username = username;
        if (email) admin.email = email;
        if (phoneNum) admin.phoneNum = phoneNum;
        
        await admin.save();
        
        // Return without password
        const { password: _, ...adminData } = admin.toJSON();
        sendSuccess(res, adminData, 'Admin updated successfully');
    } catch (error) {
        sendError(res, 'Error updating admin', 500, error);
    }
};

// 5. Delete admin
export const deleteAdmin = async (req: any, res: any) => {
    try {
        const adminId = req.params.admin_id;
        
        if (!adminId) {
            return sendValidationError(res, 'Admin ID is required');
        }
        
        const admin = await Admin.findOne({ where: { admin_id: adminId } });
        if (!admin) {
            return sendNotFound(res, 'Admin');
        }
        
        await admin.destroy();
        sendSuccess(res, null, 'Admin deleted successfully');
    } catch (error) {
        sendError(res, 'Error deleting admin', 500, error);
    }
};

// 6. Get dashboard statistics
export const getDashboardStats = async (req: any, res: any) => {
    try {
        const [
            totalUsers,
            totalAuctions,
            totalVehicles,
            totalBids,
            totalTransactions,
            activeAuctions,
            completedTransactions
        ] = await Promise.all([
            User.count(),
            Auction.count(),
            Vehicle.count(),
            Bid.count(),
            Transaction.count(),
            Auction.count({ where: { status: 'OPEN' } }),
            Transaction.count({ where: { status: 'Completed' } })
        ]);
        
        const stats = {
            totalUsers,
            totalAuctions,
            totalVehicles,
            totalBids,
            totalTransactions,
            activeAuctions,
            completedTransactions
        };
        
        sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving dashboard statistics', 500, error);
    }
};

// 7. Get all users (admin function)
export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving users', 500, error);
    }
};

// 8. Get all transactions (admin function)
export const getAllTransactions = async (req: any, res: any) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: Auction, attributes: ['title', 'status'] }
            ]
        });
        sendSuccess(res, transactions, 'Transactions retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving transactions', 500, error);
    }
};

// 9. Update auction status (admin function)
export const updateAuctionStatusByAdmin = async (req: any, res: any) => {
    try {
        const auctionId = req.params.auction_id;
        const { status } = req.body;
        
        if (!auctionId) {
            return sendValidationError(res, 'Auction ID is required');
        }
        
        if (!status || !['OPEN', 'CLOSED', 'pending'].includes(status)) {
            return sendValidationError(res, 'Valid status is required (OPEN, CLOSED, pending)');
        }
        
        const auction = await Auction.findOne({ where: { auction_id: auctionId } });
        if (!auction) {
            return sendNotFound(res, 'Auction');
        }
        
        auction.status = status;
        await auction.save();
        
        sendSuccess(res, auction, 'Auction status updated successfully');
    } catch (error) {
        sendError(res, 'Error updating auction status', 500, error);
    }
};

// 10. Delete user (admin function)
export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = req.params.user_id;
        
        if (!userId) {
            return sendValidationError(res, 'User ID is required');
        }
        
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return sendNotFound(res, 'User');
        }
        
        await user.destroy();
        sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
        sendError(res, 'Error deleting user', 500, error);
    }
};

