"use client";
import React, { useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-gray-600 mb-6">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" /> Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
        {status === "success" && (
          <p className="text-green-600 mt-4">
            If an account exists for that email, a reset link has been sent.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Unable to process request.</p>
        )}
      </div>
    </main>
  );
}


