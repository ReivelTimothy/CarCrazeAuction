import jwt from 'jsonwebtoken';
import { UUIDTypes } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Make sure to set this in .env

// Generate a JWT token
export const generateToken = (userId: UUIDTypes): string => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30d' }); // Token expires in 1 hour
};

// Verify a JWT token
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    return decoded;
  } catch (err) {
    return null;
  }
};