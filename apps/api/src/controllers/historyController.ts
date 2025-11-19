import { Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/auth';
import { ApiResponse, OutfitAnalysis } from '@shared/types/api';
import { saveAnalysisToHistory, getUserAnalysisHistory, getUserAnalysisStatistics } from '../services/historyService';

export const saveHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }, timestamp: new Date().toISOString() });
        }

        const { analysis } = req.body;
        const result = await saveAnalysisToHistory(req.user.id, analysis);

        const response: ApiResponse = {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }, timestamp: new Date().toISOString() });
        }

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        const analyses = await getUserAnalysisHistory(req.user.id, page, limit);
        const statistics = await getUserAnalysisStatistics(req.user.id);

        const response: ApiResponse = {
            success: true,
            data: { analyses, statistics },
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};