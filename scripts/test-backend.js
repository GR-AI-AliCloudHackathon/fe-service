#!/usr/bin/env node

import fetch from 'node-fetch';

// API configuration inline
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

/**
 * Simple test script to check if the Python backend is running and accessible
 */

const TEST_ENDPOINTS = [
  '/health',
  '/api/assessment',
  '/api/summarize'
];

async function testEndpoint(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = Date.now();
  
  try {
    // For /health we do a GET request, for others we do a HEAD to avoid errors
    const method = endpoint === '/health' ? 'GET' : 'HEAD';
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method, 
      signal: controller.signal 
    });
    
    clearTimeout(timeout);
    const endTime = Date.now();
    
    let result = {
      url,
      status: response.status,
      ok: response.ok,
      responseTime: endTime - startTime
    };
    
    if (endpoint === '/health' && response.ok) {
      const data = await response.json();
      result.data = data;
    }
    
    return result;
  } catch (error) {
    return {
      url,
      error: error.name === 'AbortError' ? 'Request timed out' : error.message,
      ok: false
    };
  }
}

async function runTests() {
  console.log(`Testing backend connectivity to ${API_BASE_URL}...`);
  
  try {
    // Test each endpoint
    const results = await Promise.all(TEST_ENDPOINTS.map(testEndpoint));
    
    console.log('\n=== Backend Connection Test Results ===');
    
    let allOk = true;
    
    results.forEach(result => {
      const statusSymbol = result.ok ? '✅' : '❌';
      console.log(`${statusSymbol} ${result.url}`);
      
      if (result.ok) {
        console.log(`   Status: ${result.status}, Response time: ${result.responseTime}ms`);
        if (result.data) {
          console.log(`   Data:`, result.data);
        }
      } else {
        console.log(`   Error: ${result.error || `Status ${result.status}`}`);
        allOk = false;
      }
    });
    
    console.log('\n=== Summary ===');
    if (allOk) {
      console.log('✅ All backend endpoints are accessible');
    } else {
      console.log('❌ Some backend endpoints are not accessible');
    }
    
    process.exit(allOk ? 0 : 1);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runTests();
