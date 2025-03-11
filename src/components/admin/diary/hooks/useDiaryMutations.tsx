
import { useCreateDiaryEntry, useUpdateDiaryEntry, useDeleteDiaryEntry } from "@/hooks/useApi";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DiaryEntry } from "@/types/diary";

export const useDiaryMutations = (
  updateEntriesList: (entry: DiaryEntry) => void,
  updateDialogState: (entry: DiaryEntry) => void,
  fetchData: () => Promise<void>,
  setIsDialogOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>
) => {
  const queryClient = useQueryClient();

  const createEntry = useCreateDiaryEntry({
    onSuccess: (newEntry) => {
      toast({
        title: "Запись создана",
        description: "Новая запись дневника успешно создана"
      });
      
      // Update local state with the new entry
      updateEntriesList(newEntry);
      
      // Update dialog state to reflect the saved selection
      updateDialogState(newEntry);
      
      // Refresh data to ensure everything is up to date
      fetchData();
      
      // Invalidate queries to refresh data everywhere
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
    onSuccess: (updatedEntry) => {
      toast({
        title: "Запись обновлена",
        description: "Запись дневника успешно обновлена"
      });
      
      // Update local state with the updated entry
      updateEntriesList(updatedEntry);
      
      // Update dialog state to reflect the saved selection
      updateDialogState(updatedEntry);
      
      // Refresh data to ensure everything is up to date
      fetchData();
      
      // Invalidate queries to refresh data everywhere
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
    onSuccess: (_, deletedId) => {
      toast({
        title: "Запись удалена",
        description: "Запись дневника успешно удалена"
      });
      // Remove the deleted entry from local state
      setEntries(prevEntries => prevEntries.filter(e => e.id !== deletedId));
      
      // Refresh data to ensure everything is up to date
      fetchData();
      
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
    createEntry,
    updateEntry,
    deleteEntry
  };
};
