/**
 * Custom error class for WHMCS API errors
 */
export class WhmcsApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'WhmcsApiError';
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: any) {
  if (error instanceof WhmcsApiError) {
    return {
      result: 'error',
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  return {
    result: 'error',
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    statusCode: 500
  };
}
