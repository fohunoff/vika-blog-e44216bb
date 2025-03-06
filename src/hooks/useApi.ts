
import { useCallback } from 'react';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../services/api';
import { PaginationOptions } from '../services/api/utils';

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
  queryKey: (string | number | null)[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T, (string | number | null)[]>, 'queryKey' | 'queryFn'>
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

// Cozy
export const useCozyHighlights = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cozyHighlights'], () => api.cozy.getHighlights(), options);
};

export const usePaginatedCozyHighlights = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['cozyHighlights', paginationOptions.page, paginationOptions.limit], 
    () => api.cozy.getPaginatedHighlights(paginationOptions), 
    queryOptions
  );
};

export const useCozyCategories = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cozyCategories'], () => api.cozy.getCategories(), options);
};

export const useCozyTags = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cozyTags'], () => api.cozy.getTags(), options);
};

// Cafes
export const useCafes = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cafes'], () => api.cafes.getCafes(), options);
};

export const usePaginatedCafes = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['cafes', paginationOptions.page, paginationOptions.limit], 
    () => api.cafes.getPaginatedCafes(paginationOptions), 
    queryOptions
  );
};

export const useEnrichedCafes = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['enrichedCafes'], () => api.cafes.getEnrichedCafes(), options);
};

export const usePaginatedEnrichedCafes = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['enrichedCafes', paginationOptions.page, paginationOptions.limit], 
    () => api.cafes.getPaginatedEnrichedCafes(paginationOptions), 
    queryOptions
  );
};

export const useCafe = (id: string, options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cafe', id], () => api.cafes.getCafeById(id), {
    enabled: !!id,
    ...options
  });
};

// Diary
export const useDiaryEntries = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['diaryEntries'], () => api.diary.getDiaryEntries(), options);
};

export const usePaginatedDiaryEntries = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['diaryEntries', paginationOptions.page, paginationOptions.limit], 
    () => api.diary.getPaginatedDiaryEntries(paginationOptions), 
    queryOptions
  );
};

export const useEnrichedDiaryEntries = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['enrichedDiaryEntries'], () => api.diary.getEnrichedDiaryEntries(), options);
};

export const usePaginatedEnrichedDiaryEntries = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['enrichedDiaryEntries', paginationOptions.page, paginationOptions.limit], 
    () => api.diary.getPaginatedEnrichedDiaryEntries(paginationOptions), 
    queryOptions
  );
};

// Recipes
export const useRecipes = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['recipes'], () => api.recipes.getRecipes(), options);
};

export const usePaginatedRecipes = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['recipes', paginationOptions.page, paginationOptions.limit], 
    () => api.recipes.getPaginatedRecipes(paginationOptions), 
    queryOptions
  );
};

export const useEnrichedRecipes = (queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['enrichedRecipes'], 
    () => api.recipes.getEnrichedRecipes(), 
    queryOptions
  );
};

export const usePaginatedEnrichedRecipes = (paginationOptions: PaginationOptions = {}, queryOptions?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(
    ['enrichedRecipes', paginationOptions.page, paginationOptions.limit], 
    () => api.recipes.getPaginatedEnrichedRecipes(paginationOptions), 
    queryOptions
  );
};

/**
 * Get cozy articles
 */
export const useCozyArticles = () => {
  const { api } = useApi();

  return useQuery({
    queryKey: ['cozy', 'articles'],
    queryFn: () => api.cozy.getArticles()
  });
};

export const usePaginatedCozyArticles = (paginationOptions: PaginationOptions = {}) => {
  const { api } = useApi();

  return useQuery({
    queryKey: ['cozy', 'articles', paginationOptions.page, paginationOptions.limit],
    queryFn: () => api.cozy.getPaginatedArticles(paginationOptions)
  });
};
