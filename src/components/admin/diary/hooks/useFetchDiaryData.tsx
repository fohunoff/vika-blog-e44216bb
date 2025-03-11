
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryEntry } from "@/types/diary";
import { toast } from "@/components/ui/use-toast";

export const useFetchDiaryData = () => {
  const { api } = useApi();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string}[]>([]);
  const [moods, setMoods] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [entriesData, categoriesData, tagsData, moodsData] = await Promise.all([
        api.diary.getDiaryEntries(),
        api.diary.getCategories(),
        api.diary.getTags(),
        api.diary.getMoods()
      ]);
      
      const updatedEntries = entriesData
        .map(entry => ({
          ...entry,
          categoryIds: entry.categoryIds || [entry.categoryId],
          moodIds: entry.moodIds || [entry.moodId]
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setEntries(updatedEntries);
      setCategories(categoriesData);
      setTags(tagsData);
      setMoods(moodsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить данные. Пожалуйста, попробуйте позже."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  return {
    entries,
    setEntries,
    categories,
    tags,
    moods,
    isLoading,
    fetchData
  };
};
