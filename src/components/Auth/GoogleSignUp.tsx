"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Stethoscope, User } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface GoogleSignUpProps {
  onBack: () => void;
}

export default function GoogleSignUp({ onBack }: GoogleSignUpProps) {
  const [selectedRole, setSelectedRole] = useState<"pet_parent" | "veterinarian" | "technician" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignUp = async (role: "pet_parent" | "veterinarian" | "technician") => {
    setIsLoading(true);
    setError("");
    
    try {
      // Store the selected role in sessionStorage so we can access it in the signIn callback
      sessionStorage.setItem('googleSignUpRole', role);
      
      // Initiate Google OAuth sign in
      await signIn("google", { 
        callbackUrl: "/auth/complete-profile",
        redirect: true 
      });
    } catch (error) {
      console.error("Google sign up error:", error);
      setError("Google sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: "pet_parent",
      title: "Pet Parent",
      description: "I'm looking for veterinary care for my pets",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "veterinarian",
      title: "Veterinarian",
      description: "I'm a licensed veterinarian looking to provide care",
      icon: Stethoscope,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "technician",
      title: "Vet Technician",
      description: "I'm a veterinary technician or assistant",
      icon: User,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign Up with Google
          </CardTitle>
          <p className="text-white/70 mt-2">
            Choose your role and complete your profile with Google
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-6"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Card 
                    className={`backdrop-blur-sm bg-white/5 border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                      selectedRole === role.id ? 'ring-2 ring-cyan-400 bg-white/15' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id as any)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {role.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {role.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back
            </Button>
            <Button
              onClick={() => selectedRole && handleGoogleSignUp(selectedRole)}
              disabled={!selectedRole || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Connecting to Google...
                </>
              ) : (
                "Continue with Google"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
