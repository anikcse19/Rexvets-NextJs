"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { ArrowLeft, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleSelector from "@/components/Auth/RoleSelector";
import VetRegistrationForm from "@/components/Auth/VetRegistrationForm";
import PetParentForm from "@/components/Auth/PetParentsForm";
import GoogleSignUp from "@/components/Auth/GoogleSignUp";

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<
    "pet_parent" | "veterinarian" | "technician" | null
  >(null);
  const [showGoogleSignUp, setShowGoogleSignUp] = useState(false);

  const handleRoleSelect = (
    role: "pet_parent" | "veterinarian" | "technician"
  ) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setShowGoogleSignUp(false);
  };

  const handleGoogleSignUp = () => {
    setShowGoogleSignUp(true);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
      }}
      className="min-h-screen relative overflow-hidden "
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 text-white/10"
        >
          <Heart className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-20 text-white/10"
        >
          <Stethoscope className="w-20 h-20" />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Join RexVet
              </h1>
              <p className="text-white/70 text-xl">
                Professional Veterinary Health Care Platform
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          {showGoogleSignUp ? (
            <GoogleSignUp onBack={handleBack} />
          ) : !selectedRole ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-8"
              >
                <p className="text-white/70">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          ) : selectedRole === "veterinarian" ? (
            <VetRegistrationForm />
          ) : (
            <div className="max-w-2xl mx-auto">
              {selectedRole !== "pet_parent" && (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Role Selection
                  </Button>
                </div>
              )}

              {selectedRole === "pet_parent" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Role Selection
                    </Button>
                  </div>
                  <PetParentForm />
                </motion.div>
              )}

              {selectedRole === "technician" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 shadow-2xl">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Technician Registration
                    </h2>
                    <p className="text-white/70 mb-8 text-lg">
                      Technician registration will be available soon. We&apos;re
                      working hard to bring you the best experience.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      Back to Role Selection
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
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
