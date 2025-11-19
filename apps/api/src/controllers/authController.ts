import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { ApiResponse } from '@shared/types/api';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUser(req.body);
        const response: ApiResponse = {
            success: true,
            data: { id: user.id, email: user.email },
            timestamp: new Date().toISOString(),
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await loginUser(req.body);
        const response: ApiResponse = {
            success: true,
            data: {
                user: { id: user.id, email: user.email },
                token
            },
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};