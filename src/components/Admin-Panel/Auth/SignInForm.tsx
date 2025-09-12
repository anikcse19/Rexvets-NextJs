"use client";

// import { useState } from "react";
import { useState, useRef } from "react";
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
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendCodeLoading, setIsSendCodeLoading] = useState(false);
  const [isCheckVerifyLoading, setIsCheckVerifyLoading] = useState(false);
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
        setError("Invalid email or password. Please try again.");
      } else {
        // Get the session to check user role
        const session = await getSession();
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //  forget email submit

  const handleSendResetCode = async () => {
    setIsSendCodeLoading(true);
    const data = {
      email: resetEmail,
    };
    const response = await fetch(
      "https://rexvetsemailserver.up.railway.app/sendResetCode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- THIS IS IMPORTANT
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    console.log("result", result);
    setEmailModalOpen(false);
    setCodeModalOpen(true);
    setIsSendCodeLoading(false);
  };

  const handleChangeDigit = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // code verify function

  const handleVerifyCode = async () => {
    const enteredCode = codeDigits.join("");
    setIsCheckVerifyLoading(true);

    if (enteredCode.length === 6) {
      // You can verify the code here
      console.log("Verifying code:", enteredCode);

      const data = {
        email: resetEmail,
        code: enteredCode,
      };

      const response = await fetch(
        "https://rexvetsemailserver.up.railway.app/verifyResetCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setCodeModalOpen(false);
        setPasswordModalOpen(true);
        setCodeDigits([]);
        setIsCheckVerifyLoading(false);
      }
      // Call your backend/API to verify
    } else {
      toast.error("Please enter all 6 digits.");
    }
  };
  // new password set

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const data = {
        email: resetEmail,
        newPassword: newPassword,
      };

      const response = await fetch(
        "https://rexvetsemailserver.up.railway.app/setNewPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Password reset successfully");
        setPasswordModalOpen(false);
        setResetEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
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

      {/* email modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we’ll send you a verification code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="bg-blue-700 hover:bg-blue-700"
              onClick={handleSendResetCode}
            >
              {isSendCodeLoading ? "Sending..." : "Send Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* verify code modal */}
      <Dialog open={codeModalOpen} onOpenChange={setCodeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Verification Code</DialogTitle>
            <DialogDescription>
              We’ve sent a 6-digit verification code to your email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center space-x-2 mt-4">
            {codeDigits.map((digit, idx) => (
              <Input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChangeDigit(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(ref) => {
                  inputRefs.current[idx] = ref;
                }}
                className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button
              className="bg-blue-700 hover:bg-blue-700"
              onClick={handleVerifyCode}
            >
              {isCheckVerifyLoading ? "Verify" : "Verifying"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="bg-blue-700 hover:bg-blue-700"
              onClick={handlePasswordReset}
            >
              {isChangingPassword ? "Changing..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
