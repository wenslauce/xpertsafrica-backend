import { Request, Response, NextFunction } from 'express';
import { callWhmcsApi, whmcsApiHandlers } from '../services/whmcs.service';
import { WhmcsApiError, createErrorResponse } from '../utils/errors';
import { WhmcsApiResponse, DomainWhoisResponse, TldPricingResponse, ProductsResponse, DomainSearchResult } from '../types/whmcs';

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
    res.json(data.products || []);
  } catch (error) {
    next(error);
  }
}
