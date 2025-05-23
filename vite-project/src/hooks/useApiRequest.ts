import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook for handling API requests with loading, error, and data states
 * @param apiCall - Function that returns a promise with the API response
 * @param dependencies - Array of dependencies for the useEffect hook
 * @param immediate - Whether to call the API immediately
 */
export function useApiRequest<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  immediate: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, ...dependencies]);

  useEffect(() => {
    if (immediate) {
      execute().catch(err => console.error('API request failed:', err));
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

/**
 * A custom hook for handling pagination with API requests
 */
export function usePaginatedApiRequest<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[], total: number }>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(0);
  
  const apiCall = useCallback(() => {
    return fetchFunction(page, limit).then(response => {
      setTotal(response.total);
      return response.data;
    });
  }, [fetchFunction, page, limit]);
  
  const { data, loading, error, execute } = useApiRequest<T[]>(apiCall, [page, limit]);
  
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && (!total || newPage <= Math.ceil(total / limit))) {
      setPage(newPage);
    }
  };
  
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };
  
  const totalPages = total ? Math.ceil(total / limit) : 0;
  
  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    goToPage,
    changeLimit,
    refresh: execute
  };
}
