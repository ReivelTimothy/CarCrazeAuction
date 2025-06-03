import express from 'express';
import {loginUser,registerUser,logoutUser,getAllUsers,getUserProfile,updateUserProfile,deleteUserProfile,changePassword} from '../controller/userController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const userRoutes = express.Router();
// 1. Register User
userRoutes.post('/register', /* authorizeAdmin, */ registerUser);
// 2. Login User
userRoutes.post('/login', loginUser);
// 3. Logout User
userRoutes.post('/logout', authenticateJWT, logoutUser);
// 4. Get All Users
userRoutes.get('/', authenticateJWT, getAllUsers);
// 5. Get User Profile
userRoutes.get('/getUserProfile', authenticateJWT, getUserProfile);
// 6. Update User Profile
userRoutes.put('/updateUser', authenticateJWT, updateUserProfile);
// 7. Delete User Profile
userRoutes.delete('/deleteUser', authenticateJWT, deleteUserProfile);
// 8. Change Password
userRoutes.put('/changePassword', authenticateJWT, changePassword);

export default userRoutes;