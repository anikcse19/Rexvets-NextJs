"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";

export default function AccessDeniedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToOverview = () => {
    router.push("/admin/overview");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldX className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">
              Sorry, you don't have permission to access this page.
            </p>
            <p className="text-sm">
              Your current access level: <span className="font-semibold">{session?.user?.role}</span>
            </p>
            {session?.user?.accesslist && session.user.accesslist.length > 0 && (
              <p className="text-sm mt-2">
                Available permissions: <span className="font-semibold">{session.user.accesslist.join(", ")}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleGoToOverview} 
              className="w-full"
              variant="default"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={handleGoBack} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
