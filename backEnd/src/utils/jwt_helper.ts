import jwt from 'jsonwebtoken';
import { UUIDTypes } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Make sure to set this in .env

// Generate a JWT token with role
export const generateToken = (userId: UUIDTypes, role: 'user' | 'admin'): string => {
  console.log('Generating token for userId:', userId, 'with role:', role);
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

// Verify a JWT token
export const verifyToken = (token: string): { userId: string, role: string } | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string, role: string };
    return decoded;
  } catch (err) {
    return null;
  }
};