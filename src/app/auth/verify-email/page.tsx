"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });

        if (response.ok) {
          setVerificationStatus("success");
          setMessage("Email verified successfully! You can now sign in to your account.");
        } else {
          const data = await response.json();
          setVerificationStatus("error");
          setMessage(data.error || "Verification failed. Please try again.");
        }
      } catch {
        setVerificationStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "loading":
        return <Loader2 className="w-10 h-10 text-white animate-spin" />;
      case "success":
        return <CheckCircle className="w-10 h-10 text-white" />;
      case "error":
        return <XCircle className="w-10 h-10 text-white" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case "loading":
        return "from-blue-400 to-cyan-500";
      case "success":
        return "from-green-400 to-emerald-500";
      case "error":
        return "from-red-400 to-orange-500";
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case "loading":
        return "Verifying Email";
      case "success":
        return "Email Verified";
      case "error":
        return "Verification Failed";
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
      }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </Link>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center shadow-2xl`}>
                {getStatusIcon()}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {getStatusTitle()}
              </h1>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <p className="text-white/80 text-lg leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="space-y-4">
                  {verificationStatus === "success" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/auth/signin">
                        <Button className="w-full h-14 text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          Sign In Now
                        </Button>
                      </Link>
                    </motion.div>
                  )}

                  {verificationStatus === "error" && (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link href="/auth/signup">
                          <Button className="w-full h-14 text-base bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            Create New Account
                          </Button>
                        </Link>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link href="/contact">
                          <Button
                            variant="outline"
                            className="w-full h-14 text-base bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                          >
                            Contact Support
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full h-14 text-base bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                      >
                        Back to Home
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-white/50 text-sm">
              © 2025 RexVet. Professional Veterinary Care Platform.
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
      }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-white text-lg">Loading...</div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
