
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryEntry, DiaryEntryFormData } from "@/types/models";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateDiaryEntry, useUpdateDiaryEntry, useDeleteDiaryEntry } from "@/hooks/useApi";

export const useDiaryEntries = () => {
  const { api } = useApi();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string}[]>([]);
  const [moods, setMoods] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [formData, setFormData] = useState<DiaryEntryFormData>({
    title: '',
    content: '',
    shortDescription: '',
    imageSrc: '',
    date: new Date().toISOString().split('T')[0],
    categoryIds: [],
    tagIds: [],
    moodIds: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesData, categoriesData, tagsData, moodsData] = await Promise.all([
          api.diary.getDiaryEntries(),
          api.diary.getCategories(),
          api.diary.getTags(),
          api.diary.getMoods()
        ]);
        
        // Convert single categoryId and moodId to arrays for existing entries and sort by date
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

  const queryClient = useQueryClient();
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagSelect = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, tagIds: newSelectedTags }));
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    setFormData(prev => ({ ...prev, categoryIds: newSelectedCategories }));
  };

  const handleMoodSelect = (moodId: string) => {
    const newSelectedMoods = selectedMoods.includes(moodId)
      ? selectedMoods.filter(id => id !== moodId)
      : [...selectedMoods, moodId];
    
    setSelectedMoods(newSelectedMoods);
    setFormData(prev => ({ ...prev, moodIds: newSelectedMoods }));
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      content: '',
      shortDescription: '',
      imageSrc: '',
      date: new Date().toISOString().split('T')[0],
      categoryIds: [],
      tagIds: [],
      moodIds: []
    });
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedMoods([]);
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: DiaryEntry) => {
    // Convert single categoryId and moodId to arrays if needed
    const categoryIds = Array.isArray(entry.categoryIds) ? entry.categoryIds : [entry.categoryId];
    const moodIds = Array.isArray(entry.moodIds) ? entry.moodIds : [entry.moodId];
    
    setFormData({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      shortDescription: entry.shortDescription || '',
      imageSrc: entry.imageSrc || '',
      date: entry.date,
      categoryIds: categoryIds,
      tagIds: Array.isArray(entry.tagIds) ? entry.tagIds : [],
      moodIds: moodIds
    });
    setSelectedTags(Array.isArray(entry.tagIds) ? entry.tagIds : []);
    setSelectedCategories(categoryIds);
    setSelectedMoods(moodIds);
    setSelectedEntry(entry.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (entryId: string) => {
    setSelectedEntry(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedEntry) {
        await updateEntry.mutateAsync({ id: selectedEntry, data: formData });
      } else {
        await createEntry.mutateAsync(formData);
      }
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleDelete = async () => {
    if (selectedEntry) {
      try {
        await deleteEntry.mutateAsync(selectedEntry);
      } catch (error) {
        // Error handling is done in mutation callbacks
      }
    }
  };

  // Helper function to display comma-separated names for multi-select fields
  const displayMultipleNames = (ids: string[] | undefined, items: {id: string, name: string}[]) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return 'Не выбрано';
    
    return ids
      .map(id => items.find(item => item.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return {
    entries,
    categories,
    tags,
    moods,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedEntry,
    selectedTags,
    selectedCategories,
    selectedMoods,
    formData,
    displayMultipleNames,
    handleInputChange,
    handleEditorChange,
    handleTagSelect,
    handleCategorySelect,
    handleMoodSelect,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleSave,
    handleDelete
  };
};
