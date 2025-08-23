import AccountPage from "@/components/Dashboard/Doctor/AccountPage";
import { authOptions } from "@/lib/auth";
import { checkVeterinarianStatus } from "@/lib/auth-helpers";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600">Please log in to access your account.</p>
        </div>
      </div>
    );
  }

  try {
    // First check if user is a veterinarian
    const vetStatus = await checkVeterinarianStatus(session.user.id);

    if (!vetStatus.isVeterinarian) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              {vetStatus.error === "User is not a veterinarian"
                ? "This page is only accessible to veterinarians."
                : "Unable to verify your veterinarian status."}
            </p>
            <div className="space-y-2">
              {vetStatus.error === "User is not a veterinarian" && (
                <a
                  href="/auth/register/veterinarian"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register as Veterinarian
                </a>
              )}
              <a
                href="/dashboard"
                className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Use the veterinarian data we already have from the status check
    // Serialize the data to remove circular references
    const serializedVetData = JSON.parse(
      JSON.stringify(vetStatus.veterinarian)
    );
    return (
      <div>
        <AccountPage doctorData={serializedVetData} />
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching veterinarian data:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Account Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error.message ||
              "Unable to load your veterinarian account. This might be because:"}
          </p>
          <ul className="text-sm text-gray-500 text-left mb-6">
            <li>• Your account hasn't been set up as a veterinarian yet</li>
            <li>• There was an issue with the account creation process</li>
            <li>• The account data is missing from the database</li>
          </ul>
          <div className="space-y-2">
            <a
              href="/auth/register/veterinarian"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Complete Veterinarian Registration
            </a>
            <a
              href="/dashboard"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default page;
