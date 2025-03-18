
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { DiaryEntry } from '@/types/models';
import { toast } from '@/components/ui/use-toast';

export const useDiaryEntryData = (id?: string) => {
  const { api } = useApi();
  const [entry, setEntry] = useState<DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedEntries, setRelatedEntries] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      setIsLoading(true); // Ensure we reset loading state when ID changes
      fetchEntryData();
    }
  }, [id, api.diary]);

  // Utility function to normalize array data
  const normalizeArrayData = (data: any) => {
    // Ensure tagIds is an array
    const tagIds = Array.isArray(data.tagIds) ? data.tagIds :
                  (data.tagIds ? [data.tagIds] : []);

    // Ensure categoryIds is an array
    const categoryIds = Array.isArray(data.categoryIds) ? data.categoryIds :
                       [data.categoryId || data.categoryIds].filter(Boolean);

    // Ensure moodIds is an array
    const moodIds = Array.isArray(data.moodIds) ? data.moodIds :
                   [data.moodId || data.moodIds].filter(Boolean);

    return { tagIds, categoryIds, moodIds };
  };

  // Utility function to fetch related metadata (categories, tags, moods)
  const fetchRelatedMetadata = async (categoryIds: string[], tagIds: string[], moodIds: string[]) => {
    return Promise.all([
      // Get all categories
      Promise.all(categoryIds.map((categoryId: string) => api.diary.getCategoryById(categoryId))),
      // Get all tags
      Promise.all(tagIds.map((tagId: string) => api.diary.getTagById(tagId))),
      // Get all moods
      Promise.all(moodIds.map((moodId: string) => api.diary.getMoodById(moodId))),
    ]);
  };

  // Utility function to enrich entry with metadata
  const enrichEntryWithMetadata = (entryData: any, categoryData: any[], tagsData: any[], moodData: any[]) => {
    const { tagIds, categoryIds, moodIds } = normalizeArrayData(entryData);

    return {
      ...entryData,
      tags: tagsData.filter(Boolean).map(tag => tag?.name),
      category: categoryData.filter(Boolean).find(category => category)?.name,
      mood: moodData.filter(Boolean).find(mood => mood)?.name,
      categoryIds,
      moodIds,
      tagIds
    };
  };

  // Utility function to find related entries
  const findRelatedEntries = (allEntries: any[], currentEntryId: string, enrichedEntry: any) => {
    return allEntries
      .filter(e => e.id !== currentEntryId) // Exclude current entry
      .filter(e => {
        const sameCategory = e.category === enrichedEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => enrichedEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3); // Limit to 3 related entries
  };

  // Main function to fetch entry data
  const fetchEntryData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const [entryData, allEntries] = await Promise.all([
        api.diary.getDiaryEntryById(id),
        api.diary.getEnrichedDiaryEntries()
      ]);

      if (!entryData) {
        handleEntryNotFound();
        return;
      }

      const { tagIds, categoryIds, moodIds } = normalizeArrayData(entryData);
      
      // Fetch related metadata
      const [categoryData, tagsData, moodData] = await fetchRelatedMetadata(categoryIds, tagIds, moodIds);
      
      // Create enriched entry
      const enrichedEntry = enrichEntryWithMetadata(entryData, categoryData, tagsData, moodData);
      setEntry(enrichedEntry);

      // Find and set related entries
      if (allEntries && allEntries.length) {
        const related = findRelatedEntries(allEntries, id, enrichedEntry);
        setRelatedEntries(related);
      }

    } catch (error) {
      handleError(error);
    } finally {
      // Add a small delay to ensure loading state is visible for a minimum time
      // This prevents flickering for very fast loads
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  // Error handling utility
  const handleError = (error: any) => {
    console.error("Error fetching entry:", error);
    setError(error instanceof Error ? error : new Error("An unknown error occurred"));
    toast({
      title: "Ошибка загрузки",
      description: "Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  // Not found handling utility
  const handleEntryNotFound = () => {
    const notFoundError = new Error("Запись не найдена");
    setError(notFoundError);
    toast({
      title: "Запись не найдена",
      description: "Запрашиваемая запись дневника не существует",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  return {
    entry,
    isLoading,
    relatedEntries,
    error
  };
};
