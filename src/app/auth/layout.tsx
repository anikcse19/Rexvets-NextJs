import { unstable_noStore as noStore } from "next/cache";

// Disable SSR for auth pages since they require authentication
noStore();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
