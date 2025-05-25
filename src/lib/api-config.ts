// API configuration with environment variables

// Default to localhost for development, override in production
const DEFAULT_API_URL = 'http://localhost:8000';

// Use environment variable if set
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || DEFAULT_API_URL;

// Helper function to build API URLs
export const getApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// Risk level thresholds from environment variables or defaults
export const RISK_THRESHOLDS = {
  LOW: parseInt(process.env.NEXT_PUBLIC_LOW_RISK_THRESHOLD || '39', 10),
  MEDIUM: parseInt(process.env.NEXT_PUBLIC_MEDIUM_RISK_THRESHOLD || '69', 10)
};
