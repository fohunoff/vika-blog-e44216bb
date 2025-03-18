
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

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetchEntryData();
    }
  }, [id, api.diary]);

  const fetchEntryData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const [entryData, allEntries] = await Promise.all([
        api.diary.getDiaryEntryById(id),
        api.diary.getEnrichedDiaryEntries()
      ]);

      if (!entryData) {
        toast({
          title: "Запись не найдена",
          description: "Запрашиваемая запись дневника не существует",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Ensure tagIds is an array
      const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                    (entryData.tagIds ? [entryData.tagIds] : []);

      // Ensure categoryIds is an array
      const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                         [entryData.categoryId || entryData.categoryIds].filter(Boolean);

      // Ensure moodIds is an array
      const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                     [entryData.moodId || entryData.moodIds].filter(Boolean);

      // Fetch category, tags and mood details
      const [categoryData, tagsData, moodData] = await Promise.all([
        // Get all categories
        Promise.all(categoryIds.map((categoryId: string) => api.diary.getCategoryById(categoryId))),
        // Get all tags
        Promise.all(tagIds.map((tagId: string) => api.diary.getTagById(tagId))),
        // Get all moods
        Promise.all(moodIds.map((moodId: string) => api.diary.getMoodById(moodId))),
      ]);

      // Prepare enriched entry
      const enrichedEntry = {
        ...entryData,
        tags: tagsData.filter(Boolean).map(tag => tag?.name),
        category: categoryData.filter(Boolean).find(category => category)?.name,
        mood: moodData.filter(Boolean).find(mood => mood)?.name,
        categoryIds: categoryIds,
        moodIds: moodIds,
        tagIds: tagIds
      };

      setEntry(enrichedEntry);

      // Find related entries (same category or at least one matching tag)
      if (allEntries && allEntries.length) {
        const related = allEntries
          .filter(e => e.id !== id) // Exclude current entry
          .filter(e => {
            const sameCategory = e.category === enrichedEntry.category;
            const hasMatchingTag = e.tags?.some(tag => enrichedEntry.tags?.includes(tag));
            return sameCategory || hasMatchingTag;
          })
          .slice(0, 3); // Limit to 3 related entries

        setRelatedEntries(related);
      }

    } catch (error) {
      console.error("Error fetching entry:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    entry,
    isLoading,
    relatedEntries
  };
};
