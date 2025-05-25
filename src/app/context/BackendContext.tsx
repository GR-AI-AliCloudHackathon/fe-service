"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { testBackendConnection } from "@/lib/backend-utils";
import { getApiUrl, API_BASE_URL } from "@/lib/api-config";
import toast from "react-hot-toast";

interface BackendState {
  isConnected: boolean | null;
  isLoading: boolean;
  lastChecked: Date | null;
  details: {
    ping: number | null;
    endpoints: Record<string, boolean>;
    healthStatus?: string;
    apiUrl?: string;
  };
}

interface BackendContextValue {
  backendState: BackendState;
  checkConnection: () => Promise<boolean>;
  testEndpoints: () => Promise<Record<string, boolean>>;
}

const BackendContext = createContext<BackendContextValue | undefined>(undefined);

// Endpoints to check
const API_ENDPOINTS = ["/health", "/api/assessment", "/api/summarize"];

export function BackendProvider({ children }: { children: ReactNode }) {
  const [backendState, setBackendState] = useState<BackendState>({
    isConnected: null,
    isLoading: true,
    lastChecked: null,
    details: {
      ping: null,
      endpoints: {},
      healthStatus: undefined,
      apiUrl: API_BASE_URL
    }
  });

  const testEndpoints = async (): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};
    
    // Test each endpoint with a quick HEAD request if possible
    for (const endpoint of API_ENDPOINTS) {
      try {
        // Use a short timeout to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const method = endpoint === "/health" ? "GET" : "HEAD";
        const response = await fetch(getApiUrl(endpoint), {
          method,
          signal: controller.signal,
          cache: "no-store"
        });
        
        clearTimeout(timeoutId);
        results[endpoint] = response.ok;
      } catch (error) {
        console.warn(`Endpoint ${endpoint} test failed:`, error);
        results[endpoint] = false;
      }
    }
    
    return results;
  };
  
  const checkConnection = async (): Promise<boolean> => {
    setBackendState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // Measure ping time
      const startTime = Date.now();
      const connected = await testBackendConnection();
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      // Test individual endpoints
      const endpointResults = await testEndpoints();
      
      let healthStatus: string | undefined = undefined;
      try {
        const healthResponse = await fetch(getApiUrl('/health'), { 
          cache: 'no-store' 
        });
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          healthStatus = healthData.status;
        }
      } catch (e) {
        console.warn('Could not fetch detailed health status');
      }
      
      setBackendState({
        isConnected: connected,
        isLoading: false,
        lastChecked: new Date(),
        details: {
          ping: pingTime,
          endpoints: endpointResults,
          healthStatus,
          apiUrl: API_BASE_URL
        }
      });
      
      if (!connected) {
        toast.error("Cannot connect to backend server. Some features may not work.");
      }
      
      return connected;
    } catch (error) {
      setBackendState({
        isConnected: false,
        isLoading: false,
        lastChecked: new Date(),
        details: {
          ping: null,
          endpoints: {},
          healthStatus: undefined,
          apiUrl: API_BASE_URL
        }
      });
      
      toast.error("Failed to connect to backend server.");
      return false;
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <BackendContext.Provider value={{ backendState, checkConnection, testEndpoints }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  
  if (context === undefined) {
    throw new Error("useBackend must be used within a BackendProvider");
  }
  
  return context;
}
