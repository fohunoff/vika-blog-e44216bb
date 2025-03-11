
import { useDialogState } from "./useDialogState";
import { useFormHandling } from "./useFormHandling";
import { useApiOperations } from "./useApiOperations";

export const useDiaryEntries = () => {
  const dialogState = useDialogState();
  const {
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedEntry,
    selectedTags,
    selectedCategories,
    selectedMoods,
    formData,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    setState
  } = dialogState;

  const {
    handleInputChange,
    handleEditorChange,
    handleTagSelect,
    handleCategorySelect,
    handleMoodSelect
  } = useFormHandling(setState);

  const {
    entries,
    categories,
    tags,
    moods,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    fetchData
  } = useApiOperations(setIsDialogOpen, setIsDeleteDialogOpen, setState);

  const handleSave = async () => {
    try {
      console.log("Saving with form data:", formData);
      console.log("Selected tags:", selectedTags);
      console.log("Selected categories:", selectedCategories);
      console.log("Selected moods:", selectedMoods);
      
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
    handleDelete,
    fetchData
  };
};
