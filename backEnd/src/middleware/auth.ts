import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt_helper';
// import jwt from 'jsonwebtoken';
import { UUIDTypes } from 'uuid';

interface JwtPayloadWithUserId {
    userId: string | UUIDTypes;
    role: 'user' | 'admin';
}

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: 'user' | 'admin';
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Token from 'Authorization: Bearer token'

    if (!token) {
        res.status(403).json({ message: 'No token provided' });
    }
    else {
        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
        else {
            const { userId, role } = decoded as JwtPayloadWithUserId;

            console.log('Decoded token:', role);
            
            // Store user information in req.user
            req.user = {
                userId: String(userId),
                role: role
            };

            // For backward compatibility, also store in req.body for existing endpoints
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = userId;
            req.body.role = role;

            next(); // Continue to the next middleware or route handler
        }
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Ambil role dari req.user
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'No token provided' });
        return;
    } else {
        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        } else {
            const { role } = decoded as JwtPayloadWithUserId;
            console.log('Decoded token:', role);
            // Check if the user is an admin
            if (role === 'admin') {
                next(); // User is an admin, proceed to the next middleware or route handler
                return;
            }
        }
    }
    res.status(403).json({ message: 'Forbidden: Admins only' });
    return;
};