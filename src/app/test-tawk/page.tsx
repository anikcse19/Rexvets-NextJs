"use client";

import { useEffect, useState } from "react";

export default function TestTawkPage() {
  const [tawkLoaded, setTawkLoaded] = useState(false);

  useEffect(() => {
    const checkTawk = () => {
      if (typeof window !== 'undefined' && window.Tawk_API) {
        setTawkLoaded(true);
      } else {
        setTimeout(checkTawk, 1000);
      }
    };
    
    checkTawk();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tawk.to Integration Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Tawk.to API Loaded:</span>{" "}
              <span className={tawkLoaded ? "text-green-600" : "text-red-600"}>
                {tawkLoaded ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="font-medium">Current URL:</span>{" "}
              <span className="text-blue-600">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Look for the Tawk.to chat widget in the bottom-right corner of the page</li>
            <li>If you don't see it, wait a few seconds for it to load</li>
            <li>Click on the widget to test the chat functionality</li>
            <li>Navigate to different pages to test the conditional rendering</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
          <div className="space-x-4">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Home (Should show Tawk.to)
            </a>
            <a
              href="/dashboard"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard (Should hide Tawk.to)
            </a>
            <a
              href="/admin"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Admin (Should hide Tawk.to)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
