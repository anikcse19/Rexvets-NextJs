import { useCallback, useEffect, useState } from 'react';
import {
    formatNoticePeriod,
    getNoticePeriod,
    updateNoticePeriod,
    validateNoticePeriod,
    type NoticePeriodResponse
} from '../services/noticePeriodService';

interface UseNoticePeriodOptions {
  autoLoad?: boolean;
  onSuccess?: (data: NoticePeriodResponse['data']) => void;
  onError?: (error: Error) => void;
}

interface UseNoticePeriodReturn {
  noticePeriod: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  loadNoticePeriod: () => Promise<void>;
  updateNoticePeriod: (period: number) => Promise<void>;
  validatePeriod: (period: number) => boolean;
  formatPeriod: (period: number) => string;
}

export const useNoticePeriod = (options: UseNoticePeriodOptions = {}): UseNoticePeriodReturn => {
  const { autoLoad = false, onSuccess, onError } = options;
  
  const [noticePeriod, setNoticePeriod] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load current notice period from API
  const loadNoticePeriod = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getNoticePeriod();
      if (response.success) {
        setNoticePeriod(response.data.noticePeriod);
        onSuccess?.(response.data);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to load notice period");
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  // Update notice period via API
  const updateNoticePeriodValue = useCallback(async (period: number) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      // Validate the notice period before saving
      if (!validateNoticePeriod(period)) {
        throw new Error("Invalid notice period. Must be between 0 and 1440 minutes.");
      }
      
      const response = await updateNoticePeriod(period);
      if (response.success) {
        setNoticePeriod(response.data.noticePeriod);
        setSuccessMessage(`Notice period updated to ${formatNoticePeriod(period)}`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
        onSuccess?.(response.data);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to save notice period");
      onError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [onSuccess, onError]);

  // Validation function
  const validatePeriod = useCallback((period: number): boolean => {
    return validateNoticePeriod(period);
  }, []);

  // Format function
  const formatPeriod = useCallback((period: number): string => {
    return formatNoticePeriod(period);
  }, []);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadNoticePeriod();
    }
  }, [autoLoad, loadNoticePeriod]);

  return {
    noticePeriod,
    isLoading,
    isSaving,
    error,
    successMessage,
    loadNoticePeriod,
    updateNoticePeriod: updateNoticePeriodValue,
    validatePeriod,
    formatPeriod,
  };
};

export default useNoticePeriod;


