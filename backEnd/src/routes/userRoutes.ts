import express from 'express';
import {loginUser,registerUser,logoutUser,getAllUsers,getUserProfile,updateUserProfile,deleteUserProfile} from '../controller/userController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth'; 

const userRoutes = express.Router();
// 1. Register User
userRoutes.post('/register', authorizeAdmin, registerUser);
// 2. Login User
userRoutes.post('/login', loginUser);
// 3. Logout User
userRoutes.post('/logout', authenticateJWT, logoutUser);
// 4. Get All Users
userRoutes.get('/', authenticateJWT,authorizeAdmin, getAllUsers);
// 5. Get User Profile
userRoutes.get('/UpdateUser', authenticateJWT, getUserProfile);
// 6. Update User Profile
userRoutes.put('/deleteUser', authenticateJWT, updateUserProfile);
// 7. Delete User Profile
userRoutes.delete('/Delete', authenticateJWT, deleteUserProfile);

export default userRoutes;