"use client";

import { useBackend } from "@/app/context/BackendContext";
import { useEffect, useState } from "react";

export default function BackendStatusChecker() {
  const { backendState, checkConnection } = useBackend();
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show the banner if backend is disconnected for more than a brief moment
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (backendState.isConnected === false) {
      // Wait a moment before showing the banner to prevent flashing
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [backendState.isConnected]);

  if (backendState.isLoading || !isVisible) {
    return null;
  }

  // Only show when disconnected
  return (
    <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <p className="text-sm text-red-700">
            The backend server is disconnected. GoShield will work in offline mode with limited functionality.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={() => checkConnection()}
            className="text-sm text-red-700 font-medium hover:text-red-900 underline"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
