import { Router } from 'express';
import {
  handleWhmcsApiRequest,
  checkDomainAvailability,
  getDomainsPricing,
  getProducts,
  getCurrencies,
  getInvoice,
  getOrder,
  getOrders,
  getClientDetails,
  addOrder,
  addInvoicePayment,
  addClient,
  updateClient,
  registerDomain,
  renewDomain,
  transferDomain
} from '../controllers/whmcs.controller';

const router = Router();

// General WHMCS API endpoint
router.post('/', handleWhmcsApiRequest as any);

// Domain endpoints
router.get('/domains/pricing', getDomainsPricing as any);
router.post('/domains/check', checkDomainAvailability as any);
router.post('/domains/register', registerDomain as any);
router.post('/domains/renew', renewDomain as any);
router.post('/domains/transfer', transferDomain as any);

// Product endpoints
router.get('/products', getProducts as any);

// Currency endpoints
router.get('/currencies', getCurrencies as any);

// Order endpoints
router.get('/orders', getOrders as any);
router.get('/orders/:id', getOrder as any);
router.post('/orders', addOrder as any);

// Invoice endpoints
router.get('/invoices/:id', getInvoice as any);
router.post('/invoices/:id/payment', addInvoicePayment as any);

// Client endpoints
router.get('/clients/:id', getClientDetails as any);
router.post('/clients', addClient as any);
router.put('/clients/:id', updateClient as any);

export default router;
