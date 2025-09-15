// hooks/useAccess.ts

import { useSession } from "next-auth/react";

export const useAccess = (key: string): boolean => {
  const { data: session } = useSession();

  const accessList = session?.user?.accesslist || [];
  return accessList.some((item: any) => item === key);
};
