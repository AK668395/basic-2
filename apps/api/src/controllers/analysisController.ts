import { Request, Response, NextFunction } from 'express';
import { analyzeOutfit as analyzeOutfitService } from '../services/analysisService';
import { ApiResponse } from '@shared/types/api';

export const analyzeOutfit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, occasion } = req.body;
    const image = req.file;

    const result = await analyzeOutfitService({ text, occasion, image: image?.buffer });

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};