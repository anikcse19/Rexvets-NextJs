"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoogleTestPage() {
  const { data: session, status } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google sign-in test...");
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Google OAuth Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Test Google OAuth sign-in functionality
            </p>
          </div>
          
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Sign in with Google"}
          </Button>
          
          {session && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800">Session Data:</h3>
              <pre className="text-xs text-green-700 mt-2 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            <p>Status: {status}</p>
            <p>Session: {session ? "Active" : "None"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
