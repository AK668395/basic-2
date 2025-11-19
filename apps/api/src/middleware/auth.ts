import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { ApiResponse, ApiError } from '@shared/types/api';

interface AuthenticatedRequest extends Request {
    user?: { id: string, email: string };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        const error: ApiError = { code: 'UNAUTHORIZED', message: 'No token provided' };
        const response: ApiResponse = { success: false, error, timestamp: new Date().toISOString() };
        return res.status(401).json(response);
    }

    const token = bearer.split(' ')[1].trim();
    if (!token) {
        const error: ApiError = { code: 'UNAUTHORIZED', message: 'Invalid token format' };
        const response: ApiResponse = { success: false, error, timestamp: new Date().toISOString() };
        return res.status(401).json(response);
    }

    try {
        const user = verifyToken(token);
        if (!user) {
            const error: ApiError = { code: 'UNAUTHORIZED', message: 'Invalid or expired token' };
            const response: ApiResponse = { success: false, error, timestamp: new Date().toISOString() };
            return res.status(401).json(response);
        }

        req.user = user;
        next();
    } catch (e) {
        console.error('Token verification error:', e);
        const error: ApiError = { code: 'UNAUTHORIZED', message: 'Invalid token' };
        const response: ApiResponse = { success: false, error, timestamp: new Date().toISOString() };
        return res.status(401).json(response);
    }
};