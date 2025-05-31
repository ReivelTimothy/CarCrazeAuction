import { User } from "../../models/user";
import { Admin } from "../../models/admin";
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../utils/jwt_helper';
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';


// 1. Register User
export const registerUser = async (req: any, res: any) => {
    try {
        const { username, email, password, phoneNum } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phoneNum) {
            return sendValidationError(res, 'All fields are required: username, email, password, phoneNum');
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return sendValidationError(res, 'User already exists with this email');
        }

        // Create a new user
        const newUser = await User.create({
            user_id: uuidv4(),
            username,
            email,
            password,
            phoneNum,
        });

        return sendSuccess(res, newUser, 'User registered successfully', 201);
    } catch (error) {
        sendError(res, 'Error registering user', 500, error);
    }
}

// 2. logout user
export const logoutUser = async (req: any, res: any) => {
    try {
        // Invalidate the token (this can be done by removing it from the client side)
        return sendSuccess(res, null, 'Logout successful');
    } catch (error) {
        sendError(res, 'Error logging out user', 500, error);
    }
}

// 3. Login User
export const loginUser = async (req: any, res: any) => {    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return sendValidationError(res, 'Email and password are required');
        }        // Make sure email is a string
        const emailStr = typeof email === 'string' ? email : String(email);
        
        // First try to find a user with the email
        try {
            const user = await User.findOne({
                where: {
                    email: emailStr
                }
            });

            if (user) {
                // Check if the user password is correct
                if (user.password !== password) {
                    return sendValidationError(res, 'Invalid email or password');
                }
                
                // Generate a token for the user
                const token = generateToken(user.user_id, "user");
                return sendSuccess(res, { token }, 'Login successful');
            }
            
            // If no user was found, check for an admin
            const admin = await Admin.findOne({
                where: {
                    email: emailStr
                }
            });
            
            if (admin) {
                // Check if the admin password is correct
                if (admin.password !== password) {
                    return sendValidationError(res, 'Invalid email or password');
                }
                
                // Generate a token for the admin
                const token = generateToken(admin.admin_id, "admin");
                return sendSuccess(res, { token }, 'Login successful');
            }
            
            // If we get here, neither user nor admin was found
            return sendValidationError(res, 'Invalid email or password');
        } catch (queryError) {
            sendError(res, 'Database query error', 500, queryError);
        }
    } catch (error) {
        sendError(res, 'Error logging in user', 500, error);
    }
}



// 4. Get User Profile
export const getUserProfile = async (req: any, res: any) => {    try {
        const userId = req.body.userId; // Assuming you have middleware to extract userId from token
        
        if (!userId) {
            return sendValidationError(res, 'User ID is required');
        }
        
        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return sendNotFound(res, 'User');
        }

        return sendSuccess(res, user, 'User profile retrieved successfully');
    } catch (error) {
        sendError(res, 'Error fetching user profile', 500, error);
    }
}


// 5. Update User Profile
export const updateUserProfile = async (req: any, res: any) => {    try {
        const userId = req.body.userId; // The userId is stored in req.body by the authenticateJWT middleware
        const { username, email, phoneNum } = req.body;

        if (!userId) {
            return sendValidationError(res, 'User ID is required');
        }

        if (!username || !email || !phoneNum) {
            return sendValidationError(res, 'All fields are required: username, email, phoneNum');
        }

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return sendNotFound(res, 'User');
        }

        // Update user profile
        user.username = username;
        user.email = email;
        user.phoneNum = phoneNum;
        await user.save();

        return sendSuccess(res, user, 'User profile updated successfully');
    } catch (error) {
        sendError(res, 'Error updating user profile', 500, error);
    }
}

// 6. Delete User Profile
export const deleteUserProfile = async (req: any, res: any) => {    try {
        const userId = req.body.userId; // The userId is stored in req.body by the authenticateJWT middleware

        if (!userId) {
            return sendValidationError(res, 'User ID is required');
        }

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return sendNotFound(res, 'User');
        }

        // Delete the user
        await user.destroy();

        return sendSuccess(res, null, 'User profile deleted successfully');
    } catch (error) {
        sendError(res, 'Error deleting user profile', 500, error);
    }
}

// 7. Get All Users
export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.findAll();
        return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
        sendError(res, 'Error fetching all users', 500, error);
    }
}
