'use client';

import { useEffect } from 'react';
import performanceMonitor from '@/lib/performanceMonitor';

interface PerformanceMonitorProps {
  children?: React.ReactNode;
}

export default function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
  }, []);

  return <>{children}</>;
}
