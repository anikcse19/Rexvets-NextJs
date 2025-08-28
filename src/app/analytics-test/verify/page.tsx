'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AnalyticsVerificationPage() {
  const [analyticsStatus, setAnalyticsStatus] = useState<{
    gaLoaded: boolean;
    gtmLoaded: boolean;
    dataLayerExists: boolean;
    gtagExists: boolean;
  }>({
    gaLoaded: false,
    gtmLoaded: false,
    dataLayerExists: false,
    gtagExists: false,
  });

  useEffect(() => {
    // Check analytics status after component mounts
    const checkAnalytics = () => {
      const status = {
        gaLoaded: false,
        gtmLoaded: false,
        dataLayerExists: false,
        gtagExists: false,
      };

      // Check if dataLayer exists
      if (typeof window !== 'undefined' && window.dataLayer) {
        status.dataLayerExists = true;
        console.log('✅ DataLayer found:', window.dataLayer);
      }

      // Check if gtag function exists
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        status.gtagExists = true;
        console.log('✅ gtag function found');
      }

      // Check for Google Analytics
      if (typeof window !== 'undefined') {
        // Check if GA script is loaded
        const gaScripts = document.querySelectorAll('script[src*="google-analytics"]');
        if (gaScripts.length > 0) {
          status.gaLoaded = true;
          console.log('✅ Google Analytics script found');
        }

        // Check if GTM script is loaded
        const gtmScripts = document.querySelectorAll('script[src*="googletagmanager"]');
        if (gtmScripts.length > 0) {
          status.gtmLoaded = true;
          console.log('✅ Google Tag Manager script found');
        }
      }

      setAnalyticsStatus(status);
    };

    // Check immediately
    checkAnalytics();

    // Check again after a short delay to allow scripts to load
    const timer = setTimeout(checkAnalytics, 1000);

    return () => clearTimeout(timer);
  }, []);

  const testTracking = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Test a simple event
      window.gtag('event', 'test_event', {
        event_category: 'test',
        event_label: 'analytics_verification',
        value: 1,
      });
      console.log('✅ Test event sent to Google Analytics');
      alert('Test event sent! Check Google Analytics Real-time reports.');
    } else {
      console.error('❌ gtag function not available');
      alert('Google Analytics not loaded. Check console for details.');
    }
  };

  const testDataLayer = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Push a test event to dataLayer
      window.dataLayer.push({
        event: 'test_datalayer_event',
        category: 'test',
        label: 'datalayer_verification',
        value: 1,
      });
      console.log('✅ Test event pushed to dataLayer');
      alert('Test event pushed to dataLayer! Check Google Tag Manager Preview mode.');
    } else {
      console.error('❌ dataLayer not available');
      alert('DataLayer not available. Check console for details.');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Verification</CardTitle>
          <CardDescription>
            Verify that Google Analytics and Google Tag Manager are properly loaded and working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Check */}
          <div>
            <h3 className="font-semibold mb-3">Analytics Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${analyticsStatus.gaLoaded ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analyticsStatus.gaLoaded ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">Google Analytics</span>
                </div>
                <p className="text-sm mt-1">
                  {analyticsStatus.gaLoaded ? '✅ Loaded' : '❌ Not loaded'}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${analyticsStatus.gtmLoaded ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analyticsStatus.gtmLoaded ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">Google Tag Manager</span>
                </div>
                <p className="text-sm mt-1">
                  {analyticsStatus.gtmLoaded ? '✅ Loaded' : '❌ Not loaded'}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${analyticsStatus.dataLayerExists ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analyticsStatus.dataLayerExists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">DataLayer</span>
                </div>
                <p className="text-sm mt-1">
                  {analyticsStatus.dataLayerExists ? '✅ Available' : '❌ Not available'}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${analyticsStatus.gtagExists ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${analyticsStatus.gtagExists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">gtag Function</span>
                </div>
                <p className="text-sm mt-1">
                  {analyticsStatus.gtagExists ? '✅ Available' : '❌ Not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div>
            <h3 className="font-semibold mb-3">Test Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={testTracking} variant="outline" className="w-full">
                Test Google Analytics Event
              </Button>
              <Button onClick={testDataLayer} variant="outline" className="w-full">
                Test DataLayer Event
              </Button>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Environment Variables:</h3>
            <div className="text-sm space-y-1 text-blue-700">
              <p>• NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'Not set'}</p>
              <p>• NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || 'Not set'}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">Next Steps:</h3>
            <ul className="text-sm space-y-1 text-yellow-700">
              <li>1. Check that all status indicators are green</li>
              <li>2. Click test buttons to verify tracking</li>
              <li>3. Check Google Analytics Real-time reports</li>
              <li>4. Check Google Tag Manager Preview mode</li>
              <li>5. Verify environment variables are set correctly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
