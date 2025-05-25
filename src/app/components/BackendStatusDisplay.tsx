"use client";

import { useState } from "react";
import { useBackend } from "@/app/context/BackendContext";

export default function BackendStatusDisplay() {
  const { backendState, checkConnection } = useBackend();
  const [showDetails, setShowDetails] = useState(false);
  
  if (backendState.isLoading) {
    return (
      <div className="inline-flex items-center px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-md">
        <svg className="w-3 h-3 mr-1 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Checking connection...
      </div>
    );
  }

  if (backendState.isConnected === true) {
    return (
      <div className="relative">
        <div 
          className="inline-flex items-center px-2 py-1 text-xs text-green-800 bg-green-100 rounded-md cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Connected to backend
          <svg 
            className={`w-3 h-3 ml-1 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {showDetails && (
          <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-200 rounded shadow-lg text-xs">
            <div className="mb-1">
              <span className="font-medium">API URL:</span> {backendState.details.apiUrl}
            </div>
            {backendState.details.ping !== null && (
              <div className="mb-1">
                <span className="font-medium">Response time:</span> {backendState.details.ping}ms
              </div>
            )}
            {backendState.details.healthStatus && (
              <div className="mb-1">
                <span className="font-medium">Status:</span> {backendState.details.healthStatus}
              </div>
            )}
            <div className="mb-1">
              <span className="font-medium">Endpoints:</span>
              <ul className="mt-1">
                {Object.entries(backendState.details.endpoints).map(([endpoint, status]) => (
                  <li key={endpoint} className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {endpoint}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right mt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  checkConnection();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-2 py-1 text-xs text-red-800 bg-red-100 rounded-md">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      Backend disconnected
      <button 
        onClick={() => checkConnection()} 
        className="ml-2 text-xs text-red-800 hover:text-red-900 underline"
      >
        Retry
      </button>
    </div>
  );
}
