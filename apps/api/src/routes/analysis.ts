import { Router } from 'express';
import { analyzeOutfit } from '../controllers/analysisController';
import { validateRequest } from '../middleware/validation';
import { AnalysisRequestSchema } from '@shared/schemas/validation';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), validateRequest({ body: AnalysisRequestSchema }), analyzeOutfit);

export default router;