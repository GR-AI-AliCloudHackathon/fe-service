#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// API configuration inline
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

/**
 * Test script to send audio files to the Python backend API endpoints
 * Usage: node test-audio-endpoints.js <path-to-audio-file>
 */

// Default test file if none provided
const DEFAULT_TEST_FILE = path.join(__dirname, './test-audio.wav');

async function testEndpoint(endpoint, audioFilePath) {
  console.log(`Testing endpoint: ${endpoint} with file: ${audioFilePath}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(audioFilePath)) {
      console.error(`Error: File ${audioFilePath} does not exist`);
      return { ok: false, error: 'File not found' };
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(audioFilePath));
    
    // Add additional fields based on endpoint
    if (endpoint === '/api/assessment') {
      formData.append('driver_id', 'test-driver');
      formData.append('location_lat', '0');
      formData.append('location_lng', '0');
      formData.append('route_expected', 'test-route');
    } else if (endpoint === '/api/summarize') {
      formData.append('incident_id', `test-incident-${Date.now()}`);
      formData.append('ride_id', 'test-ride');
      formData.append('passenger_id', 'test-passenger');
      formData.append('driver_id', 'test-driver');
      formData.append('additional_context', 'Test from debug script');
    }
    
    console.log(`Sending request to ${API_BASE_URL}${endpoint}...`);
    
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      timeout: 30000 // 30 second timeout
    });
    const endTime = Date.now();
    
    const responseData = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      responseTime: endTime - startTime,
      data: responseData
    };
  } catch (error) {
    console.error(`Error testing endpoint ${endpoint}:`, error);
    return { ok: false, error: error.message };
  }
}

async function main() {
  // Get file path from command line args or use default
  const audioFilePath = process.argv[2] || DEFAULT_TEST_FILE;
  
  console.log('==============================');
  console.log('GoShield Backend API Test Tool');
  console.log('==============================');
  console.log(`API URL: ${API_BASE_URL}`);
  
  // Test health endpoint first
  try {
    console.log('\nTesting health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health check passed:', data);
    } else {
      console.error('❌ Health check failed:', healthResponse.status);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
    process.exit(1);
  }
  
  // Test assessment endpoint
  console.log('\n--- Testing Assessment Endpoint ---');
  const assessmentResult = await testEndpoint('/api/assessment', audioFilePath);
  
  if (assessmentResult.ok) {
    console.log(`✅ Assessment endpoint success (${assessmentResult.responseTime}ms)`);
    console.log('Risk Level:', assessmentResult.data.risk_level);
    console.log('Risk Score:', assessmentResult.data.risk_score);
    if (assessmentResult.data.transcribed_text) {
      console.log('Transcription:', assessmentResult.data.transcribed_text);
    }
  } else {
    console.error('❌ Assessment endpoint failed:', assessmentResult.error || assessmentResult.status);
  }
  
  // Test summarize endpoint
  console.log('\n--- Testing Summarize Endpoint ---');
  const summarizeResult = await testEndpoint('/api/summarize', audioFilePath);
  
  if (summarizeResult.ok) {
    console.log(`✅ Summarize endpoint success (${summarizeResult.responseTime}ms)`);
    console.log('Evidence Kit ID:', summarizeResult.data.evidence_kit_id);
    if (summarizeResult.data.summary) {
      console.log('Summary:', summarizeResult.data.summary);
    }
  } else {
    console.error('❌ Summarize endpoint failed:', summarizeResult.error || summarizeResult.status);
  }
  
  console.log('\n==============================');
}

main().catch(error => {
  console.error('Script execution error:', error);
  process.exit(1);
});
