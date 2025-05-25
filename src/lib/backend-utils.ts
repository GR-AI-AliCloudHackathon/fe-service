import { getApiUrl } from './api-config';

/**
 * Tests the connection to the backend API
 * @returns Promise<boolean> True if the backend is accessible, false otherwise
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('/health'), { 
      method: 'GET',
      cache: 'no-store'
    });
    
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      console.log('Backend health check:', data);
      return data.status === 'healthy';
    }
    return false;
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    return false;
  }
}
