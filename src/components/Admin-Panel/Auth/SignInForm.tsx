"use client";

// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Stethoscope,
  Heart,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().catch(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendCodeLoading, setIsSendCodeLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  // Check for password reset token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setPasswordModalOpen(true);
    }
  }, []);
  // login submit
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EmailNotVerified") {
          setError("Please verify your email before signing in.");
        } else if (result.error.includes("Account is temporarily locked")) {
          setError("Account is temporarily locked due to too many failed login attempts. Please try again later.");
        } else if (result.error.includes("Account is deactivated")) {
          setError("Account is deactivated. Please contact support.");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        // Get the session to check user role
        const session = await getSession();
        
        // Check if user has admin role
        if (session?.user?.role !== "admin") {
          setError("Access denied. Admin privileges required.");
          await signIn("credentials", { redirect: false }); // Sign out the user
          return;
        }
        
        toast.success("Login successful! Redirecting to admin dashboard...");
        router.push("/admin/overview");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //  forget email submit

  const handleSendResetCode = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSendCodeLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password reset instructions sent to your email.");
        setEmailModalOpen(false);
        setResetEmail("");
      } else {
        toast.error(result.error || "Failed to send reset instructions.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setIsSendCodeLoading(false);
    }
  };

  // Password reset function - simplified since we use email links
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return;
    }

    setIsChangingPassword(true);
    try {
      // Get token from URL parameters (this would be passed from the email link)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        toast.error("Invalid reset token. Please use the link from your email.");
        return;
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password reset successfully! You can now sign in.");
        setPasswordModalOpen(false);
        setResetEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);
        // Redirect to sign in
        router.push("/admin/auth/signin");
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6235651/pexels-photo-6235651.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-teal-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              REXVET Portal
            </h1>
            <p className="text-blue-100 text-sm">
              Compassionate care for every companion
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-blue-100">
                Sign in to access your veterinary dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <Alert className="bg-red-500/20 border-red-400/50 text-red-100">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@vetclinic.com"
                    {...register("email")}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-blue-400 transition-all duration-200"
                  />
                  {errors.email && (
                    <Alert className="bg-red-500/20 border-red-400/50 text-red-100">
                      <AlertDescription>
                        {errors.email.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-blue-400 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <Alert className="bg-red-500/20 border-red-400/50 text-red-100">
                      <AlertDescription>
                        {errors.password.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked as boolean)
                      }
                      className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-white text-sm cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(true)}
                    className="text-blue-200 hover:text-white text-sm underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer */}
              {/* <div className="text-center pt-4 border-t border-white/20">
                <p className="text-blue-100 text-sm">
                  Need access?{" "}
                  <button className="text-blue-200 hover:text-white underline transition-colors">
                    Contact Administrator
                  </button>
                </p>
              </div> */}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-white/60">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Trusted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4" />
              <span className="text-sm">Professional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a password reset link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="admin@rexvet.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="bg-blue-700 hover:bg-blue-700"
              onClick={handleSendResetCode}
              disabled={isSendCodeLoading}
            >
              {isSendCodeLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Password Modal - This will be used when user clicks reset link from email */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
            <DialogDescription>
              Enter your new password. It must be at least 8 characters with uppercase, lowercase, number, and special character.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="bg-blue-700 hover:bg-blue-700"
              onClick={handlePasswordReset}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Changing..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
