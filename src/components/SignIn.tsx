import { SignUpData } from "@/lib";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

interface IProps {
  onSignIn?: (email: string, password: string) => void;
  onGoogleSignIn?: () => void;
  onGoogleSignUp?: () => void;
  onSignUp?: (data: SignUpData) => void;
  onForgotPassword?: () => void;
}

const SignIn: React.FC<IProps> = ({
  onSignIn,
  onGoogleSignIn,
  onGoogleSignUp,
  onSignUp,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (signUpData.password !== signUpData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSignUp?.(signUpData);
  };

  const handleGoogleSignUp = () => {
    onGoogleSignUp?.();
  };

  const handleSignUpInputChange = (
    field: keyof typeof signUpData,
    value: string
  ) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email, password);
  };

  const handleGoogleSignIn = () => {
    onGoogleSignIn?.();
  };

  const handleForgotPassword = () => {
    onForgotPassword?.();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden  mt-5">
      {/* Tab Header */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("signin")}
          className={`flex-1 py-3 px-4 sm:px-6 cursor-pointer text-center font-semibold transition-colors text-sm sm:text-base ${
            activeTab === "signin"
              ? "bg-blue-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-3 px-4 sm:px-6 cursor-pointer text-center font-semibold transition-colors text-sm sm:text-base ${
            activeTab === "register"
              ? "bg-blue-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Register
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "signin" && (
          <>
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-semibold cursor-pointer py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors mb-6 text-sm sm:text-base"
            >
              <FaGoogle size={24} className="text-white" />
              Sign in with Google
            </button>

            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-left">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 underline"
                >
                  Forgot Password
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-md transition-colors text-sm sm:text-base"
              >
                Sign in
              </button>
            </form>
          </>
        )}

        {activeTab === "register" && (
          <>
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-semibold cursor-pointer py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-colors mb-6 text-sm sm:text-base"
            >
              <FaGoogle size={24} className="text-white" />
              Sign up with Google
            </button>

            {/* Sign Up Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Name Input */}
              <input
                type="text"
                placeholder="Name"
                value={signUpData.name}
                onChange={(e) =>
                  handleSignUpInputChange("name", e.target.value)
                }
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />

              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) =>
                  handleSignUpInputChange("email", e.target.value)
                }
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />

              {/* Phone Number Input */}
              <input
                type="tel"
                placeholder="Phone Number"
                value={signUpData.phone}
                onChange={(e) =>
                  handleSignUpInputChange("phone", e.target.value)
                }
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />

              {/* State Input */}
              <input
                type="text"
                placeholder="State"
                value={signUpData.state}
                onChange={(e) =>
                  handleSignUpInputChange("state", e.target.value)
                }
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                required
              />

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) =>
                    handleSignUpInputChange("password", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showSignUpPassword ? "Hide password" : "Show password"
                  }
                >
                  {showSignUpPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={signUpData.confirmPassword}
                  onChange={(e) =>
                    handleSignUpInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={handleSignUp}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-md transition-colors text-sm sm:text-base"
              >
                Sign up
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(SignIn);
