"use client";

import { useEffect, useState } from "react";
import { testBackendConnection } from "@/lib/backend-utils";
import toast from "react-hot-toast";

export default function BackendStatusChecker() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testBackendConnection();
      setIsConnected(connected);
      
      if (!connected) {
        toast.error("Cannot connect to backend server. Some features may not work.");
      }
    };
    
    checkConnection();
  }, []);

  return null; // This component doesn't render anything, just checks the connection
}
