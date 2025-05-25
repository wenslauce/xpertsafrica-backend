import { Request, Response, NextFunction } from 'express';
import { callWhmcsApi, whmcsApiHandlers } from '../services/whmcs.service';
import { WhmcsApiError, createErrorResponse } from '../utils/errors';
import { WhmcsApiResponse, DomainWhoisResponse, TldPricingResponse, ProductsResponse, DomainSearchResult, CurrenciesResponse, Currency } from '../types/whmcs';

/**
 * Handle a general WHMCS API request
 */
export async function handleWhmcsApiRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { action, ...params } = req.body;
    
    // Log the request info (excluding sensitive data)
    const logParams = { ...params };
    
    // Remove sensitive info from logs
    if (logParams.password) logParams.password = '***REDACTED***';
    if (logParams.secret) logParams.secret = '***REDACTED***';
    if (logParams.card_number) logParams.card_number = '***REDACTED***';
    if (logParams.card_cvc) logParams.card_cvc = '***REDACTED***';
    
    // Get client IP for logging purposes only
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    console.log(`WHMCS API Request - Action: ${action} - Client IP: ${clientIp}`, logParams);

    // Check for required action parameter
    if (!action) {
      throw new WhmcsApiError('Missing required parameter: action', 400);
    }

    // Check if there's a special handler for this action
    if (action in whmcsApiHandlers) {
      // @ts-ignore - we've already checked that the action exists in whmcsApiHandlers
      const data = await whmcsApiHandlers[action](params);
      return res.json({
        result: 'success',
        data
      });
    }

    // Standard API call
    const data = await callWhmcsApi(action, params);
    return res.json({
      result: 'success',
      data
    });
  } catch (error) {
    console.error('WHMCS API Error:', error);
    
    // If it's already our custom error, use it directly
    if (error instanceof WhmcsApiError) {
      return res.status(error.statusCode).json({
        result: 'error',
        message: error.message,
        details: error.details
      });
    }
    
    // Otherwise pass to global error handler
    next(error);
  }
}

/**
 * Get domains pricing
 */
export async function getDomainsPricing(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi<TldPricingResponse>('GetTldPricing');
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Check domain availability
 */
export async function checkDomainAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      throw new WhmcsApiError('Domain is required', 400);
    }
    
    const data = await callWhmcsApi<DomainWhoisResponse>('DomainWhois', { domain });
    
    // Format the response to match the frontend expectation
    const result: DomainSearchResult = {
      domain,
      status: data.status === 'available' ? 'available' : 'registered',
      price: data.pricing ? parseFloat(data.pricing.register) : undefined,
      currency: data.currency || '$'
    };
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get available products
 */
export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { gid, pid, currencyid } = req.query;
    
    const params: Record<string, any> = {
      currencyid: currencyid || 1
    };
    
    if (gid) params.gid = gid;
    if (pid) params.pid = pid;
    
    const data = await callWhmcsApi<ProductsResponse>('GetProducts', params);

    // Check if we have a valid response with products
    if (data.result === 'success' && data.products && data.products.product) {
      // Return the products array
      res.json({
        result: 'success',
        products: data.products.product
      });
    } else {
      // Return an empty array if no products found
      res.json({
        result: 'success',
        products: []
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
}

/**
 * Get available currencies
 */
export async function getCurrencies(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Fetching currencies from WHMCS API');
    
    // No additional parameters needed for GetCurrencies call
    const data = await callWhmcsApi<CurrenciesResponse>('GetCurrencies', {});

    // Check if we have a valid response with currencies
    if (data.result === 'success' && data.currencies && data.currencies.currency) {
      // Return the currencies data
      res.json({
        result: 'success',
        currencies: data.currencies.currency
      });
    } else {
      // Return an empty object if no currencies found
      res.json({
        result: 'success',
        currencies: {}
      });
    }
  } catch (error) {
    console.error('Error fetching currencies:', error);
    next(error);
  }
}

/**
 * Get invoice details
 */
export async function getInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await callWhmcsApi('GetInvoice', { invoiceid: id });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get order details
 */
export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await callWhmcsApi('GetOrders', { id });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get orders list
 */
export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, userid, limit = 25, offset = 0 } = req.query;
    const params: Record<string, any> = { limitstart: offset, limitnum: limit };
    
    if (status) params.status = status;
    if (userid) params.userid = userid;
    
    const data = await callWhmcsApi('GetOrders', params);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get client details
 */
export async function getClientDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await callWhmcsApi('GetClientsDetails', { clientid: id });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Add new order
 */
export async function addOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi('AddOrder', req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Add invoice payment
 */
export async function addInvoicePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await callWhmcsApi('AddInvoicePayment', { ...req.body, invoiceid: id });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Add new client
 */
export async function addClient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi('AddClient', req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Update client details
 */
export async function updateClient(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await callWhmcsApi('UpdateClient', { ...req.body, clientid: id });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Register a new domain
 */
export async function registerDomain(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi('DomainRegister', req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Renew a domain
 */
export async function renewDomain(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi('DomainRenew', req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * Transfer a domain
 */
export async function transferDomain(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await callWhmcsApi('DomainTransfer', req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
