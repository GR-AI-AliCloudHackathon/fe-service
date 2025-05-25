/**
 * This script tests the integration between the Next.js frontend and Python backend
 * It simulates sending an audio file and handling the response
 */
import fs from 'fs';
import path from 'path';
import { getApiUrl } from './api-config';

// Utility for making FormData work in Node.js
async function createFormDataWithFile(filePath: string, fieldName: string): Promise<FormData> {
  const formData = new FormData();
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Create File object
    const file = new File([fileBuffer], fileName, { 
      type: fileName.endsWith('.wav') ? 'audio/wav' : 'audio/webm'
    });
    
    formData.append(fieldName, file);
    return formData;
  } catch (error) {
    console.error('Error creating FormData with file:', error);
    throw error;
  }
}

export async function testAssessmentEndpoint(audioFilePath: string): Promise<void> {
  try {
    console.log('Testing assessment endpoint with file:', audioFilePath);
    
    const formData = await createFormDataWithFile(audioFilePath, 'audio_file');
    formData.append('driver_id', 'test-driver');
    formData.append('location_lat', '0');
    formData.append('location_lng', '0');
    formData.append('route_expected', 'test-route');
    
    const response = await fetch(getApiUrl('/api/assessment'), {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Assessment result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Assessment test failed:', error);
    throw error;
  }
}

export async function testSummarizeEndpoint(audioFilePath: string): Promise<void> {
  try {
    console.log('Testing summarize endpoint with file:', audioFilePath);
    
    const formData = await createFormDataWithFile(audioFilePath, 'audio_file');
    formData.append('incident_id', `test-incident-${Date.now()}`);
    formData.append('ride_id', 'test-ride');
    formData.append('passenger_id', 'test-passenger');
    formData.append('driver_id', 'test-driver');
    formData.append('additional_context', 'This is a test of the summarize endpoint');
    
    const response = await fetch(getApiUrl('/api/summarize'), {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Summarize result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Summarize test failed:', error);
    throw error;
  }
}
