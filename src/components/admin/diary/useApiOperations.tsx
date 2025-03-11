
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/models";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateDiaryEntry, useUpdateDiaryEntry, useDeleteDiaryEntry } from "@/hooks/useApi";

export const useApiOperations = (
  setIsDialogOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void
) => {
  const { api } = useApi();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string}[]>([]);
  const [moods, setMoods] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    fetchData();
  }, [api]);

  const createEntry = useCreateDiaryEntry({
    onSuccess: () => {
      toast({
        title: "Запись создана",
        description: "Новая запись дневника успешно создана"
      });
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating entry:", error);
      toast({
        variant: "destructive",
        title: "Ошибка создания",
        description: "Не удалось создать запись. Пожалуйста, попробуйте позже."
      });
    }
  });

  const updateEntry = useUpdateDiaryEntry({
    onSuccess: () => {
      toast({
        title: "Запись обновлена",
        description: "Запись дневника успешно обновлена"
      });
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating entry:", error);
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: "Не удалось обновить запись. Пожалуйста, попробуйте позже."
      });
    }
  });

  const deleteEntry = useDeleteDiaryEntry({
    onSuccess: () => {
      toast({
        title: "Запись удалена",
        description: "Запись дневника успешно удалена"
      });
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting entry:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить запись. Пожалуйста, попробуйте позже."
      });
    }
  });

  return {
    entries,
    categories,
    tags,
    moods,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry
  };
};
