import axios from 'axios';
import * as querystring from 'querystring';
import { WhmcsApiError } from '../utils/errors';
import { WhmcsApiResponse, DomainWhoisResponse, TldPricingResponse, ProductsResponse } from '../types/whmcs';

// WHMCS API configuration
const WHMCS_API_URL = process.env.WHMCS_API_URL;
const WHMCS_API_IDENTIFIER = process.env.WHMCS_API_IDENTIFIER;
const WHMCS_API_SECRET = process.env.WHMCS_API_SECRET;

/**
 * Call the WHMCS API with the provided action and parameters
 */
export async function callWhmcsApi<T = any>(
  action: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    console.log(`WHMCS API Call - Action: ${action}`, params);

    // Validate API configuration
    if (!WHMCS_API_URL || !WHMCS_API_IDENTIFIER || !WHMCS_API_SECRET) {
      throw new WhmcsApiError('Missing WHMCS API configuration', 500);
    }

    // Build form data payload
    const formData = new URLSearchParams();
    formData.append('identifier', WHMCS_API_IDENTIFIER);
    formData.append('secret', WHMCS_API_SECRET);
    formData.append('action', action);
    formData.append('responsetype', 'json');

    // Add all other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Make the API call
    const response = await axios.post(WHMCS_API_URL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = response.data;
    console.log(`WHMCS API Response - Action: ${action}`, data);

    // Check for WHMCS API error response
    if (data.result === 'error') {
      console.error(`WHMCS API Error - Action: ${action}`, data);
      throw new WhmcsApiError(
        data.message || 'WHMCS API returned an error',
        400,
        data
      );
    }

    // Return the data (typically in the data property, but some WHMCS endpoints use different structures)
    return data;
  } catch (error) {
    console.error(`WHMCS API Error (${action}):`, error);

    if (error instanceof WhmcsApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      // Handle IP restriction errors
      if (error.response?.data && typeof error.response.data === 'string' && 
          error.response.data.includes('Invalid IP')) {
        console.error(`IP restriction error - Server IP needs to be whitelisted in WHMCS`);
        throw new WhmcsApiError(
          'Server IP not authorized. Please contact your WHMCS administrator to whitelist the server IP.',
          403,
          { type: 'IPRestriction' }
        );
      }

      // Handle other Axios errors
      throw new WhmcsApiError(
        error.response?.data?.message || error.message || 'API request failed',
        error.response?.status || 500,
        error.response?.data
      );
    }

    // Handle any other errors
    throw new WhmcsApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
}

/**
 * Special handling for specific WHMCS API actions
 */
export const whmcsApiHandlers = {
  // Add specialized handlers for specific WHMCS actions
  
  // Example: AddPayMethod handler
  async AddPayMethod(params: Record<string, any>) {
    // Validation
    if (!params.clientid) {
      throw new WhmcsApiError('Client ID is required for AddPayMethod', 400);
    }
    
    if (!params.type) {
      throw new WhmcsApiError('Payment method type is required', 400);
    }
    
    // For Stripe, ensure we have a token
    if (params.gateway_module === 'stripe' && !params.card_token) {
      throw new WhmcsApiError('Card token is required for Stripe payment methods', 400);
    }
    
    // Call the API
    return callWhmcsApi('AddPayMethod', params);
  }
};
