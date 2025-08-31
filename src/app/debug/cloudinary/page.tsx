"use client";

import React, { useState } from 'react';
import { debugCloudinaryUrl, parseCloudinaryUrl } from '@/lib/utils/cloudinary';

export default function CloudinaryDebugPage() {
  const [url, setUrl] = useState('');
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDebug = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    try {
      const result = await debugCloudinaryUrl(url);
      setDebugResult(result);
    } catch (error) {
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const handleParseOnly = () => {
    if (!url.trim()) return;
    
    const result = parseCloudinaryUrl(url);
    setDebugResult({ parsed: result });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Cloudinary URL Debug Tool</h1>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Cloudinary URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleDebug}
            disabled={loading || !url.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Debugging...' : 'Debug URL'}
          </button>
          
          <button
            onClick={handleParseOnly}
            disabled={!url.trim()}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse Only
          </button>
        </div>
        
        {debugResult && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Debug Results</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Example URLs to Test</h2>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-gray-100 rounded">
              <strong>Valid URL:</strong> https://res.cloudinary.com/di6zff0rd/image/upload/v1756573524/rexvets/chat/images/chat_68b310b945eff53f43207200_2025-08-30T17-05-20.webp
            </div>
            <div className="p-2 bg-gray-100 rounded">
              <strong>Invalid URL (double extension):</strong> https://res.cloudinary.com/di6zff0rd/image/upload/v1756573524/rexvets/chat/images/chat_68b310b945eff53f43207200_2025-08-30T17-05-20.webp.webp
            </div>
            <div className="p-2 bg-gray-100 rounded">
              <strong>Non-Cloudinary URL:</strong> https://example.com/image.jpg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
