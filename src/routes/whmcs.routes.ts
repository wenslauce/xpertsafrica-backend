import { Router } from 'express';
import { handleWhmcsApiRequest, checkDomainAvailability, getDomainsPricing, getProducts } from '../controllers/whmcs.controller';

const router = Router();

// General WHMCS API endpoint
router.post('/', handleWhmcsApiRequest as any);

// Specific endpoints
router.get('/domains/pricing', getDomainsPricing as any);
router.post('/domains/check', checkDomainAvailability as any);
router.get('/products', getProducts as any);

export default router;
