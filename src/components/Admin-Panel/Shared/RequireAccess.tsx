"use client";

import { useAccess } from "@/hooks/use-access";

export default function RequireAccess({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const canAccess = useAccess(permission);

  console.log("can access", canAccess);

  if (!canAccess) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center py-12">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.5 9.5l5 5m0-5l-5 5"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="mb-4 max-w-md text-center text-gray-600">
          Sorry, you do not have permission to view this page or perform this
          action.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => window.history.back()}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
