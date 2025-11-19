import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiResponse, ApiError } from '@shared/types/api';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validateRequest = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error: any) {
      const apiError: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.flatten ? error.flatten().fieldErrors : error.issues,
      };
      const response: ApiResponse = {
        success: false,
        error: apiError,
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }
  };
};