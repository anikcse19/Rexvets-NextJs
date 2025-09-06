import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook to manage user online status
 * Updates the server when user is online and sets to offline on unmount or tab close
 */
export function useOnlineStatus() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (!session?.user) return;
    
    // Set user as online when component mounts
    const setOnlineStatus = async (status: boolean) => {
      try {
        await fetch('/api/user/online-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isOnline: status }),
        });
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };
    
    // Set user as online when component mounts
    setOnlineStatus(true);
    
    // Set user as offline when component unmounts or tab closes
    const handleBeforeUnload = () => {
      setOnlineStatus(false);
    };
    
    // Listen for tab/browser close events
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup: set user as offline and remove event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOnlineStatus(false);
    };
  }, [session]);
}
