import { User } from "../../models/user";
import { Admin } from "../../models/admin";
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../utils/jwt_helper';
const SECRET_KEY = 'RAHASIA123';


// 1. Register User
export const registerUser = async (req: any, res: any) => {
    try {
        const { username, email, password, phoneNum } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = await User.create({
            user_id: uuidv4(),
            username,
            email,
            password,
            phoneNum,
        });

        return res.status(201).json({ message: 'User registered successfully' , user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// 2. logout user
export const logoutUser = async (req: any, res: any) => {
    try {
        // Invalidate the token (this can be done by removing it from the client side)
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// 3. Login User
export const loginUser = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(401).json({ message: 'Invalid email or password' });  
            } else {
                // Check if the password is correct
                if (admin.password !== password) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                // Generate a token for the admin
                const token = generateToken(admin.admin_id,"admin");
                return res.status(200).json({ message: 'Login successful', token ,  });
            }
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a token for the user
        const token = generateToken(user.user_id,"user");
        
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



// 4. Get User Profile
export const getUserProfile = async (req: any, res: any) => {
    try {
        const userId = req.body.userId; // Assuming you have middleware to extract userId from token

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// 5. Update User Profile
export const updateUserProfile = async (req: any, res: any) => {
    try {
        const userId = req.userId; // Assuming you have middleware to extract userId from token
        const { username, email, phoneNum } = req.body;

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile
        user.username = username;
        user.email = email;
        user.phoneNum = phoneNum;
        await user.save();

        return res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// 6. Delete User Profile
export const deleteUserProfile = async (req: any, res: any) => {
    try {
        const userId = req.userId; // Assuming you have middleware to extract userId from token

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        return res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// 7. Get All Users
export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
