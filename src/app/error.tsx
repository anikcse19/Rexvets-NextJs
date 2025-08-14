"use client"; // Error components must be Client Components

import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main error card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl">
        {/* Icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-50 animate-ping"></div>
            <div className="relative bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title and description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold  mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Don&apos;t worry, it happens to the best of us. Let&apos;s get you
            back on track.
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-red-400 text-sm font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-gray-500 text-xs mt-1">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Go Home
          </button>
        </div>

        {/* Footer message */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            If this problem persists, please contact support
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
