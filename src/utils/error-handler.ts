import { logger } from './logger.js';

export class SalesforceError extends Error {
  constructor(
    message: string,
    public readonly errorCode?: string,
    public readonly fields?: string[]
  ) {
    super(message);
    this.name = 'SalesforceError';
  }
}

export class MCPToolError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'MCPToolError';
  }
}

export function handleSalesforceError(error: unknown, context: string): { success: false; error: string } {
  logger.error(`Salesforce error in ${context}:`, error);

  if (error instanceof SalesforceError) {
    return {
      success: false,
      error: `${error.message}${error.errorCode ? ` (${error.errorCode})` : ''}`,
    };
  }

  if (error && typeof error === 'object' && 'message' in error) {
    // Handle jsforce errors
    const jsforceError = error as any;
    if (jsforceError.errorCode) {
      return {
        success: false,
        error: `Salesforce API error: ${jsforceError.message} (${jsforceError.errorCode})`,
      };
    }

    if (Array.isArray(jsforceError) && jsforceError.length > 0) {
      // Handle validation errors
      const errorMessages = jsforceError.map((err: any) => 
        `${err.message}${err.fields ? ` (fields: ${err.fields.join(', ')})` : ''}`
      ).join('; ');
      return {
        success: false,
        error: `Validation errors: ${errorMessages}`,
      };
    }

    return {
      success: false,
      error: (error as Error).message,
    };
  }

  return {
    success: false,
    error: 'An unknown error occurred',
  };
}

export function validateRequiredFields(data: Record<string, unknown>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );

  if (missingFields.length > 0) {
    throw new SalesforceError(
      `Missing required fields: ${missingFields.join(', ')}`,
      'REQUIRED_FIELD_MISSING',
      missingFields
    );
  }
}

export function sanitizeSOQLInput(input: string): string {
  // Basic SOQL injection prevention
  const dangerous = [';', '--', '/*', '*/', 'xp_', 'sp_'];
  
  for (const pattern of dangerous) {
    if (input.toLowerCase().includes(pattern)) {
      throw new SalesforceError(
        `Potentially dangerous SQL pattern detected: ${pattern}`,
        'INVALID_QUERY'
      );
    }
  }

  return input.trim();
}