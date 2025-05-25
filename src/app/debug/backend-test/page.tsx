"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useBackend } from '@/app/context/BackendContext';
import { testBackendConnection } from '@/lib/backend-utils';
import { getApiUrl } from '@/lib/api-config';
import toast from 'react-hot-toast';
import { AssessmentResponse, EvidenceKit } from '@/types/assessment';
import Link from 'next/link';

export default function BackendTestPage() {
  const { backendState, checkConnection } = useBackend();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [verboseOutput, setVerboseOutput] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('assessment');
  const [assessmentResponse, setAssessmentResponse] = useState<AssessmentResponse | null>(null);
  const [evidenceKit, setEvidenceKit] = useState<EvidenceKit | null>(null);

  useEffect(() => {
    // Force a connection check when the page loads
    checkConnection();
  }, []);

  const handleSelectFile = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setTestResults({});
    setAssessmentResponse(null);
    setEvidenceKit(null);

    try {
      const formData = new FormData();
      formData.append('audio_file', file);
      
      // Add metadata based on the selected endpoint
      if (selectedEndpoint === 'assessment') {
        formData.append('driver_id', 'test-driver');
        formData.append('location_lat', '0');
        formData.append('location_lng', '0');
        formData.append('route_expected', 'test-route');
      } else {
        formData.append('incident_id', `test-incident-${Date.now()}`);
        formData.append('ride_id', 'test-ride');
        formData.append('passenger_id', 'test-passenger');
        formData.append('driver_id', 'test-driver');
        formData.append('additional_context', 'Test from debug page');
      }
      
      const endpoint = selectedEndpoint === 'assessment' ? '/api/assessment' : '/api/summarize';
      
      toast.loading(`Sending audio to ${endpoint}...`);
      
      const startTime = Date.now();
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        body: formData
      });
      const endTime = Date.now();
      
      toast.dismiss();
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      setTestResults({
        endpoint,
        status: response.status,
        elapsedMs: endTime - startTime,
        responseSize: JSON.stringify(result).length,
        timestamp: new Date().toISOString(),
        rawResponse: result,
      });
      
      if (selectedEndpoint === 'assessment') {
        setAssessmentResponse(result);
      } else {
        setEvidenceKit(result);
      }
      
      toast.success(`Successfully received response from ${endpoint}`);
    } catch (error: any) {
      console.error('Test failed:', error);
      toast.error(`Error: ${error.message}`);
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setIsLoading(true);
    try {
      toast.loading('Testing health endpoint...');
      const connected = await testBackendConnection();
      toast.dismiss();

      if (connected) {
        toast.success('Health check successful!');
      } else {
        toast.error('Health check failed');
      }
      
      setTestResults({
        endpoint: '/health',
        status: connected ? 'OK' : 'Failed',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Backend Integration Test</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Backend Status</h2>
        <div className="flex items-center gap-4">
          <div>
            Status: {backendState.isLoading ? (
              <span className="text-blue-600">Checking...</span>
            ) : backendState.isConnected ? (
              <span className="text-green-600">Connected</span>
            ) : (
              <span className="text-red-600">Disconnected</span>
            )}
          </div>
          <div>
            Last Checked: {backendState.lastChecked?.toLocaleTimeString() || 'Never'}
          </div>
          <button 
            onClick={() => checkConnection()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            disabled={isLoading || backendState.isLoading}
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">API Health Test</h2>
          <button 
            onClick={testHealthEndpoint}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isLoading}
          >
            Test Health Endpoint
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Audio Test</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Select Endpoint:</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="endpoint"
                  checked={selectedEndpoint === 'assessment'}
                  onChange={() => setSelectedEndpoint('assessment')}
                  className="mr-2"
                />
                <span>/api/assessment</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="endpoint"
                  checked={selectedEndpoint === 'summarize'}
                  onChange={() => setSelectedEndpoint('summarize')}
                  className="mr-2"
                />
                <span>/api/summarize</span>
              </label>
            </div>
          </div>
          <button 
            onClick={handleSelectFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Select Audio File'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="audio/*"
          />
        </div>
      </div>
      
      {Object.keys(testResults).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={verboseOutput} 
                onChange={() => setVerboseOutput(!verboseOutput)} 
                className="mr-2"
              />
              <span className="text-sm">Show Raw Response</span>
            </label>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="mb-2">
              <span className="font-semibold">Endpoint:</span> {testResults.endpoint}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> {testResults.status}
            </div>
            {testResults.elapsedMs && (
              <div className="mb-2">
                <span className="font-semibold">Response time:</span> {testResults.elapsedMs}ms
              </div>
            )}
            {testResults.error && (
              <div className="mb-2 text-red-600">
                <span className="font-semibold">Error:</span> {testResults.error}
              </div>
            )}
            <div className="mb-2">
              <span className="font-semibold">Timestamp:</span> {testResults.timestamp}
            </div>
            
            {verboseOutput && testResults.rawResponse && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Raw Response:</h3>
                <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(testResults.rawResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
      
      {assessmentResponse && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Risk Assessment</h2>
          <div className="bg-white p-4 rounded border">
            <div className="mb-2">
              <span className="font-semibold">Risk Level:</span> 
              <span className={`ml-2 px-2 py-0.5 text-sm rounded ${
                assessmentResponse.risk_level === "HIGH" ? "bg-red-100 text-red-800" :
                assessmentResponse.risk_level === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              }`}>
                {assessmentResponse.risk_level}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Risk Score:</span> {assessmentResponse.risk_score}
            </div>
            {assessmentResponse.transcribed_text && (
              <div className="mb-2">
                <span className="font-semibold">Transcription:</span>
                <p className="mt-1 text-sm italic bg-gray-50 p-3 rounded">
                  "{assessmentResponse.transcribed_text}"
                </p>
              </div>
            )}
            {assessmentResponse.action_required && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <span className="font-bold text-red-600">Action Required!</span>
                {assessmentResponse.push_notification && (
                  <p className="mt-1">{assessmentResponse.push_notification}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {evidenceKit && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Evidence Kit</h2>
          <div className="bg-white p-4 rounded border">
            <div className="mb-2">
              <span className="font-semibold">Evidence Kit ID:</span> {evidenceKit.evidence_kit_id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Incident ID:</span> {evidenceKit.incident_details?.incident_id}
            </div>
            
            {evidenceKit.transcript && (
              <div className="mb-4">
                <span className="font-semibold">Transcript:</span>
                <p className="mt-1 text-sm italic bg-gray-50 p-3 rounded">
                  "{evidenceKit.transcript}"
                </p>
              </div>
            )}
            
            {evidenceKit.summary && (
              <div className="mb-4">
                <span className="font-semibold">Summary:</span>
                <p className="mt-1 text-sm bg-gray-50 p-3 rounded">
                  {evidenceKit.summary}
                </p>
              </div>
            )}
            
            {evidenceKit.risk_factors && (
              <div className="mb-4">
                <span className="font-semibold">Risk Factors:</span>
                <div className="mt-1 text-sm bg-gray-50 p-3 rounded">
                  {evidenceKit.risk_factors.key_phrases?.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium">Key Phrases: </span>
                      {evidenceKit.risk_factors.key_phrases.join(", ")}
                    </div>
                  )}
                  {evidenceKit.risk_factors.threat_indicators?.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium">Threat Indicators: </span>
                      {evidenceKit.risk_factors.threat_indicators.join(", ")}
                    </div>
                  )}
                  {evidenceKit.risk_factors.context_analysis && (
                    <div>
                      <span className="font-medium">Context Analysis: </span>
                      {evidenceKit.risk_factors.context_analysis}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {evidenceKit.recommended_actions?.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">Recommended Actions:</span>
                <ul className="list-disc list-inside mt-1 text-sm bg-gray-50 p-3 rounded">
                  {evidenceKit.recommended_actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
