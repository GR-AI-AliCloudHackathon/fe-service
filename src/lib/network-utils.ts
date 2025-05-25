/**
 * Network utilities for handling API requests, retries and error standardization
 */
import { getApiUrl } from './api-config';
import toast from 'react-hot-toast';

interface ApiErrorOptions {
  showToast?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

const defaultOptions: ApiErrorOptions = {
  showToast: true,
  retryCount: 1,
  retryDelay: 1000
};

/**
 * Handles API requests with built-in retries and standardized error handling
 */
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  errorOptions: ApiErrorOptions = {}
): Promise<T> {
  const { showToast, retryCount, retryDelay } = { ...defaultOptions, ...errorOptions };
  
  let lastError: Error | null = null;
  const maxRetries = retryCount || 0;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for ${endpoint}`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      const response = await fetch(getApiUrl(endpoint), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error: any) {
      lastError = error;
      
      // Only show toast on final attempt
      if (attempt === maxRetries && showToast) {
        if (error.message.includes('Failed to fetch')) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(`API Error: ${error.message}`);
        }
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError || new Error('Unknown API error');
}

/**
 * Checks if a network connection issue is likely due to CORS
 */
export function isCorsError(error: any): boolean {
  // CORS errors often manifest as opaque responses or failed network requests
  return (
    error.message?.includes('CORS') ||
    error.message?.includes('opaque') ||
    error.name === 'TypeError' && error.message?.includes('Failed to fetch')
  );
}

/**
 * Safe wrapper for audio upload requests with better error handling
 */
export async function uploadAudioWithRetry(
  endpoint: string, 
  formData: FormData, 
  maxRetries = 1
): Promise<any> {
  return apiRequest(endpoint, {
    method: 'POST',
    body: formData
  }, {
    showToast: true,
    retryCount: maxRetries,
    retryDelay: 800
  });
}

/**
 * Delay function for better user experience
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
