import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
  importer: () => Promise<{ default: React.ComponentType<any> }>;
  placeholderHeight?: number;
  props?: Record<string, any>;
}

// Renders a light skeleton until the section scrolls ~300px into view, then loads & mounts it.
export default function LazyLoad({ importer, placeholderHeight = 220, props = {} }: LazyLoadProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView]);

  const Dynamic = React.useMemo(
    () =>
      dynamic(importer, {
        ssr: false,
        loading: () => (
          <div
            style={{ height: placeholderHeight }}
            className="w-full bg-gray-100 animate-pulse rounded-lg"
          />
        ),
      }),
    [importer, placeholderHeight]
  );

  return (
    <div ref={ref} className="w-full">
      {inView ? (
        <Suspense fallback={<div style={{ height: placeholderHeight }} />}> <Dynamic {...props} /> </Suspense>
      ) : (
        <div style={{ height: placeholderHeight }} className="w-full bg-gray-100 animate-pulse rounded-lg" />
      )}
    </div>
  );
}
