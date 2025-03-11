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

export const useEnrichedCafes = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['enrichedCafes'], () => api.cafes.getEnrichedCafes(), options);
};

export const useCafe = (id: string, options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['cafe', id], () => api.cafes.getCafeById(id), {
    enabled: !!id,
    ...options
  });
};

// Diary
export const useDiaryEntry = (id: string, options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  const { api } = useApi();
  return useApiQuery(['diary', 'entry', id], () => api.diary.getDiaryEntryById(id), {
    enabled: !!id,
    ...options
  });
};

export const useCreateDiaryEntry = (options?: UseMutationOptions<DiaryEntry, Error, DiaryEntryFormData>) => {
  const { api } = useApi();
  return useApiMutation(
    (data: DiaryEntryFormData) => api.diary.createDiaryEntry(data),
    options
  );
};

export const useUpdateDiaryEntry = (options?: UseMutationOptions<DiaryEntry, Error, { id: string; data: DiaryEntryFormData }>) => {
  const { api } = useApi();
  return useApiMutation(
    ({ id, data }: { id: string; data: DiaryEntryFormData }) => api.diary.updateDiaryEntry(id, data),
    options
  );
};

export const useDeleteDiaryEntry = (options?: UseMutationOptions<void, Error, string>) => {
  const { api } = useApi();
  return useApiMutation(
    (id: string) => api.diary.deleteDiaryEntry(id),
    options
  );
};

// Diary
export const useDiaryEntries = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['diaryEntries'], () => api.diary.getDiaryEntries(), options);
};

export const useEnrichedDiaryEntries = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['enrichedDiaryEntries'], () => api.diary.getEnrichedDiaryEntries(), options);
};

// Recipes
export const useRecipes = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  return useApiQuery(['recipes'], () => api.recipes.getRecipes(), options);
};

/**
 * Get cozy articles
 */
export const useCozyArticles = (options?: UseQueryOptions<any, Error, any, (string | number | null)[]>) => {
  const { api } = useApi();

  return useQuery({
    queryKey: ['cozy', 'articles'],
    queryFn: () => api.cozy.getArticles(),
    ...options
  });
};
