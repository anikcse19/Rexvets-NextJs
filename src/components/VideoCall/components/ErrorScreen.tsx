"use client";
import { useRouter } from "next/navigation";

const ErrorScreen: React.FC = () => {
  const router = useRouter();

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
      }}
      className="h-screen flex flex-col gap-6 items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 bg-red-500 rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">No Appointment Found</h1>
        <p className="text-gray-300 text-base mb-8 leading-relaxed">
          We couldn't find the appointment details. Please check the link or
          contact support for assistance.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
