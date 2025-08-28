"use client";

const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
      }}
      className="h-screen flex flex-col gap-6 items-center justify-center"
    >
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-20 h-20 border-4 border-pink-500 border-b-transparent rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Loading Video Call</h1>
        <p className="text-gray-300 text-sm">Preparing your secure connection...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
