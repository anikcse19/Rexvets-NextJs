'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, initGTM, trackPageView, GA_MEASUREMENT_ID, GTM_ID } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  children?: React.ReactNode;
}

export default function GoogleAnalytics({ children }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize Google Analytics and GTM on mount
  useEffect(() => {
    // Only initialize in production or when IDs are provided
    if (process.env.NODE_ENV === 'production' || GA_MEASUREMENT_ID || GTM_ID) {
      initGA();
      initGTM();
    }
  }, []);

  // Track page views when route changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Google Tag Manager NoScript component
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

// Google Analytics Script component
export function GoogleAnalyticsScript() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
