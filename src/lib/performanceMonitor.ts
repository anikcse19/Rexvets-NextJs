// Performance monitoring utility for tracking Core Web Vitals
import { trackPerformance } from "./analytics";

interface PerformanceMetrics {
  cls: number;
  lcp: number;
  fid: number;
  fcp: number;
  ttfb: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private isInitialized: boolean = false;

  constructor() {
    this.metrics = {
      cls: 0,
      lcp: 0,
      fid: 0,
      fcp: 0,
      ttfb: 0,
    };
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    // Monitor CLS (Cumulative Layout Shift)
    try {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        console.log("🔍 CLS Update:", this.metrics.cls.toFixed(3));
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("CLS monitoring not supported:", e);
    }

    // Monitor LCP (Largest Contentful Paint)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        console.log("🔍 LCP Update:", this.metrics.lcp.toFixed(0) + "ms");
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP monitoring not supported:", e);
    }

    // Monitor FCP (First Contentful Paint)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.fcp = entries[0].startTime;
        console.log("🔍 FCP Update:", this.metrics.fcp.toFixed(0) + "ms");
      });
      observer.observe({ entryTypes: ["first-contentful-paint"] });
    } catch (e) {
      console.warn("FCP monitoring not supported:", e);
    }

    // Monitor TTFB (Time to First Byte)
    if ("PerformanceNavigationTiming" in window) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        console.log("🔍 TTFB:", this.metrics.ttfb.toFixed(0) + "ms");
      }
    }

    // Monitor FID (First Input Delay)
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            const firstInputEntry = entry as PerformanceEventTiming;
            this.metrics.fid =
              firstInputEntry.processingStart - firstInputEntry.startTime;
            console.log("🔍 FID Update:", this.metrics.fid.toFixed(0) + "ms");
          }
        });
        observer.observe({ entryTypes: ["first-input"] });
      } catch (e) {
        console.warn("FID monitoring not supported:", e);
      }
    }

    // Report metrics after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.reportMetrics();
      }, 2000);
    });
  }

  reportMetrics() {
    console.log("📊 Performance Metrics:", {
      CLS: this.metrics.cls.toFixed(3),
      LCP: this.metrics.lcp.toFixed(0) + "ms",
      FCP: this.metrics.fcp.toFixed(0) + "ms",
      FID: this.metrics.fid.toFixed(0) + "ms",
      TTFB: this.metrics.ttfb.toFixed(0) + "ms",
    });

    // Send to Google Analytics
    trackPerformance.coreWebVitals(this.metrics);
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Track specific performance events
  trackPageLoadTime() {
    if (typeof window === "undefined") return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      trackPerformance.pageLoadTime(loadTime);
    }
  }

  trackApiResponseTime(
    endpoint: string,
    startTime: number,
    success: boolean = true
  ) {
    const responseTime = Date.now() - startTime;
    trackPerformance.apiResponseTime(endpoint, responseTime, success);
  }

  // Track resource loading performance
  trackResourceTiming() {
    if (typeof window === "undefined") return;

    const resources = performance.getEntriesByType("resource");
    const slowResources = resources.filter(
      (resource) => resource.duration > 1000 // Resources taking more than 1 second
    );

    if (slowResources.length > 0) {
      console.warn("🐌 Slow resources detected:", slowResources);

      slowResources.forEach((resource) => {
        const resourceEntry = resource as PerformanceResourceTiming;
        trackPerformance.apiResponseTime(
          resource.name,
          resource.duration,
          resourceEntry.transferSize > 0
        );
      });
    }
  }

  // Track memory usage (if available)
  trackMemoryUsage() {
    if (typeof window === "undefined" || !("memory" in performance)) return;

    const memory = (performance as any).memory;
    console.log("🧠 Memory Usage:", {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + "MB",
    });
  }

  // Track user interactions
  trackUserInteractions() {
    if (typeof window === "undefined") return;

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener("scroll", () => {
      const scrollDepth = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) *
          100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener("beforeunload", () => {
      const timeOnPage = Date.now() - startTime;
      trackPerformance.pageLoadTime(timeOnPage);
    });
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
