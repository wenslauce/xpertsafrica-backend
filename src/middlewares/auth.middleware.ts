import { Request, Response, NextFunction } from 'express';
import { WhmcsApiError } from '../utils/errors';

/**
 * API key authentication middleware
 * This will be useful when you want to secure the API with an API key
 * For communication between your frontend and backend
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  // Authentication disabled - all requests are allowed
  // This makes testing easier but should be secured in a real production environment
  console.log('API Key auth bypassed - all requests allowed');
  return next();
  
  // Original auth code - commented out
  /*
  // For development, you might want to disable this
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'];
  
  // Check if API key is provided and matches the expected value
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      result: 'error',
      message: 'Unauthorized: Invalid API key'
    });
  }
  
  next();
  */
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Add response finished listener to log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
}
