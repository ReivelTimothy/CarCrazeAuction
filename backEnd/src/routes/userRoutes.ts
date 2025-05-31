import express from 'express';
import {loginUser,registerUser,logoutUser,getAllUsers,getUserProfile,updateUserProfile,deleteUserProfile} from '../controller/userController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth'; 

const userRoutes = express.Router();

// User routes with appropriate authentication
userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', authenticateJWT, logoutUser);
userRoutes.get('/', authenticateJWT, authorizeAdmin, getAllUsers);
userRoutes.get('/getUserProfile', authenticateJWT, getUserProfile);
userRoutes.put('/updateUser', authenticateJWT, updateUserProfile);
userRoutes.delete('/deleteUser', authenticateJWT, deleteUserProfile);

export default userRoutes;