"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, User, ArrowRight } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { US_STATES } from "@/lib";

function CompleteProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Prevent SSR issues by checking if we're on the client
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      language: "en",
      timezone: "UTC"
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Pre-fill form with session data if available
    if (session.user) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: session.user.phoneNumber || "",
        state: session.user.state || "",
        city: session.user.city || "",
        address: session.user.address || "",
        zipCode: session.user.zipCode || "",
        emergencyContact: session.user.emergencyContact || {
          name: "",
          phone: "",
          relationship: ""
        },
        preferences: session.user.preferences || {
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          language: session.user.locale || "en",
          timezone: "UTC"
        }
      }));
    }
  }, [session, status, router]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard based on user role
        const role = session?.user?.role || "pet_parent";
        router.push(`/dashboard/${role === "pet_parent" ? "pet-parent" : role}`);
      } else {
        setError(data.error || "Failed to complete profile");
      }
    } catch (error) {
      console.error("Profile completion error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

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
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-white/70">
              Welcome, {session.user?.name}! Let's get you set up.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone Number */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label
                      htmlFor="phoneNumber"
                      className="text-white/90 text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </motion.div>

                  {/* State */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label
                      htmlFor="state"
                      className="text-white/90 text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      <MapPin className="w-4 h-4" />
                      State *
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                    >
                      <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* City */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label
                      htmlFor="city"
                      className="text-white/90 text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      <MapPin className="w-4 h-4" />
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                      placeholder="Enter your city"
                    />
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label
                      htmlFor="address"
                      className="text-white/90 text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                      placeholder="Enter your address"
                    />
                  </motion.div>

                  {/* Zip Code */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Label
                      htmlFor="zipCode"
                      className="text-white/90 text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                      placeholder="Enter your zip code"
                    />
                  </motion.div>

                  {/* Emergency Contact */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="emergencyName"
                          className="text-white/90 text-sm font-medium mb-2"
                        >
                          Contact Name
                        </Label>
                        <Input
                          id="emergencyName"
                          value={formData.emergencyContact.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                          }))}
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                          placeholder="Emergency contact name"
                        />
                      </div>
                      
                      <div>
                        <Label
                          htmlFor="emergencyPhone"
                          className="text-white/90 text-sm font-medium mb-2"
                        >
                          Contact Phone
                        </Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyContact.phone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                          }))}
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                          placeholder="Emergency contact phone"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label
                        htmlFor="emergencyRelationship"
                        className="text-white/90 text-sm font-medium mb-2"
                      >
                        Relationship
                      </Label>
                      <Input
                        id="emergencyRelationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                        }))}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                        placeholder="e.g., Spouse, Parent, Friend"
                      />
                    </div>
                  </motion.div>

                  {/* Preferences */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white">Preferences</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={formData.preferences.notifications.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                email: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                        />
                        <Label htmlFor="emailNotifications" className="text-white/90">
                          Email Notifications
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          checked={formData.preferences.notifications.sms}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                sms: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                        />
                        <Label htmlFor="smsNotifications" className="text-white/90">
                          SMS Notifications
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={formData.preferences.notifications.push}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                push: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                        />
                        <Label htmlFor="pushNotifications" className="text-white/90">
                          Push Notifications
                        </Label>
                      </div>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-14 text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          Complete Profile
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
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

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  );
}
