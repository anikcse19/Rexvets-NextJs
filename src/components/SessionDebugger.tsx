"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SessionDebuggerProps {
  show?: boolean;
}

export default function SessionDebugger({ show = false }: SessionDebuggerProps) {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const debugMode = urlParams.get('debugSession') === '1' || show;
      
      if (debugMode) {
        setDebugInfo({
          session,
          status,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          cookies: document.cookie,
        });
      }
    }
  }, [session, status, show]);

  if (!debugInfo) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100000] bg-gray-900 text-white p-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <strong>Session Debug:</strong> Status: {status} | 
            User: {session?.user?.email || 'None'} | 
            Role: {session?.user?.role || 'None'}
          </div>
          <button 
            onClick={() => setDebugInfo(null)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
        <details className="mt-1">
          <summary className="cursor-pointer text-blue-300">View Full Debug Info</summary>
          <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
