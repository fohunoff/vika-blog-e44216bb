import { useCallback } from 'react';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Hook to provide easy access to the API services
 */
export const useApi = () => {
  // Return the API service
  return { api };
};

/**
 * Hook for making API queries with React Query
 */
export const useApiQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    ...options
  });
};

/**
 * Hook for making API mutations with React Query
 */
export const useApiMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn,
    ...options
  });
};

/**
 * Example usage hooks for specific endpoints
 */

// Home
export const useHomeHighlights = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['homeHighlights'], () => api.home.getHighlights(), options);
};

export const useHomeCategories = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['homeCategories'], () => api.home.getCategories(), options);
};

export const useHomeTags = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['homeTags'], () => api.home.getTags(), options);
};

// Cafes
export const useCafes = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['cafes'], () => api.cafes.getCafes(), options);
};

export const useEnrichedCafes = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['enrichedCafes'], () => api.cafes.getEnrichedCafes(), options);
};

export const useCafe = (id: string, options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['cafe', id], () => api.cafes.getCafeById(id), {
    enabled: !!id,
    ...options
  });
};

// Diary
export const useDiaryEntries = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['diaryEntries'], () => api.diary.getDiaryEntries(), options);
};

export const useEnrichedDiaryEntries = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['enrichedDiaryEntries'], () => api.diary.getEnrichedDiaryEntries(), options);
};

// Recipes
export const useRecipes = (options?: UseQueryOptions<any, Error, any, string[]>) => {
  return useApiQuery(['recipes'], () => api.recipes.getRecipes(), options);
};

/**
 * Get home articles
 */
export const useHomeArticles = () => {
  const { api } = useApi();
  
  return useQuery({
    queryKey: ['home', 'articles'],
    queryFn: () => api.home.getArticles()
  });
};
