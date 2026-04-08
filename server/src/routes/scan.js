import { Router } from 'express';
import scanLimiter from '../middleware/rateLimiter.js';
import { validateScanInput } from '../middleware/validate.js';
import { scan } from '../controllers/scanController.js';

const router = Router();

router.post('/', scanLimiter, validateScanInput, scan);

export default router;
