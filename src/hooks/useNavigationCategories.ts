
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Category } from '@/services/api/mainApi';

/**
 * Custom hook to fetch navigation categories data
 * to be used across multiple components
 */
export const useNavigationCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { api } = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await api.main.getIndexCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [api.main]);

  return { categories, isLoading, error };
};
