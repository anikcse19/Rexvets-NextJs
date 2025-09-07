import config from "@/config/env.config";

// Types
export interface NoticePeriodResponse {
  success: boolean;
  message: string;
  data: {
    noticePeriod: number;
    timezone?: string;
    updatedAt?: Date;
  };
}

export interface NoticePeriodRequest {
  noticePeriod: number;
}

export interface ApiError {
  error: string;
  details?: any;
}

// Utility functions
const createApiUrl = (endpoint: string): string => {
  const baseUrl = config.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}${endpoint}`;
};

const createHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
});

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP error! status: ${response.status}` };
    }
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const logApiCall = (method: string, endpoint: string, data?: any): void => {
  console.log(`[API] ${method} ${endpoint}`, data ? { data } : '');
};

const logApiError = (method: string, endpoint: string, error: any): void => {
  console.error(`[API ERROR] ${method} ${endpoint}:`, error);
};

// Core API functions
const makeApiRequest = async <T>(
  method: 'GET' | 'PUT' | 'POST' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<T> => {
  const url = createApiUrl(endpoint);
  const headers = createHeaders();
  
  logApiCall(method, endpoint, data);

  const requestOptions: RequestInit = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(url, requestOptions);
    return await handleApiResponse<T>(response);
  } catch (error) {
    logApiError(method, endpoint, error);
    throw error;
  }
};

// Notice Period specific functions
export const updateNoticePeriod = async (noticePeriod: number): Promise<NoticePeriodResponse> => {
  return makeApiRequest<NoticePeriodResponse>(
    'PUT',
    '/api/veterinarian/notice-period',
    { noticePeriod }
  );
};

export const getNoticePeriod = async (): Promise<NoticePeriodResponse> => {
  return makeApiRequest<NoticePeriodResponse>(
    'GET',
    '/api/veterinarian/notice-period'
  );
};

// Higher-order functions for error handling and retry logic
export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (...args: T): Promise<R> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        console.log(`[RETRY] Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
    
    throw lastError!;
  };
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: Error) => void
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const err = error as Error;
      if (errorHandler) {
        errorHandler(err);
      }
      throw err;
    }
  };
};

// Enhanced functions with retry and error handling
export const updateNoticePeriodWithRetry = withRetry(updateNoticePeriod);
export const getNoticePeriodWithRetry = withRetry(getNoticePeriod);

export const updateNoticePeriodWithErrorHandling = withErrorHandling(
  updateNoticePeriod,
  (error) => console.error('Failed to update notice period:', error)
);

export const getNoticePeriodWithErrorHandling = withErrorHandling(
  getNoticePeriod,
  (error) => console.error('Failed to get notice period:', error)
);

// Utility functions for validation
export const validateNoticePeriod = (noticePeriod: number): boolean => {
  return Number.isInteger(noticePeriod) && noticePeriod >= 0 && noticePeriod <= 1440;
};

export const formatNoticePeriod = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

// Default export with all functions
const noticePeriodService = {
  updateNoticePeriod,
  getNoticePeriod,
  updateNoticePeriodWithRetry,
  getNoticePeriodWithRetry,
  updateNoticePeriodWithErrorHandling,
  getNoticePeriodWithErrorHandling,
  validateNoticePeriod,
  formatNoticePeriod,
};

export default noticePeriodService;
