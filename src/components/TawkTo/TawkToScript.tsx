"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TawkToScript = () => {
  const pathname = usePathname();

  // Routes that should NOT show the Tawk.to widget
  const excludedRoutes = [
    "/VideoCall",
    "/join-video-call",
    "/video-call",
    "/admin",
    "/dashboard",
    "/auth",
  ];

  // Check if current route should show Tawk.to widget
  const shouldShowTawk = !excludedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    // Only load Tawk.to if the route allows it
    if (!shouldShowTawk) {
      // Hide Tawk.to widget if it's already loaded
      if (typeof window !== 'undefined' && window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
      return;
    }

    // Prevent multiple script injections
    if (typeof window !== 'undefined' && window.Tawk_API) {
      // Show widget if it's already loaded
      window.Tawk_API.showWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/66b2449e1601a2195ba16d74/1i4k5o34n";
    script.charset = "UTF-8";
    script.async = true;
    script.setAttribute("crossorigin", "*");

    script.onerror = () => {
      console.error("Failed to load Tawk.to script.");
    };

    document.body.appendChild(script);

    // Cleanup function to remove script if component unmounts
    return () => {
      const existingScript = document.querySelector(
        'script[src="https://embed.tawk.to/66b2449e1601a2195ba16d74/1i4k5o34n"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [shouldShowTawk]);

  return null;
};

export default TawkToScript;
