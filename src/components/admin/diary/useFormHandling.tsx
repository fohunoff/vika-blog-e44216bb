
import { DiaryFormState } from "./types";

export const useFormHandling = (
  setState: (state: any) => void
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev: any) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleEditorChange = (content: string) => {
    setState((prev: any) => ({
      ...prev,
      formData: { ...prev.formData, content }
    }));
  };

  const handleTagSelect = (tagId: string) => {
    setState((prev: any) => {
      // Убедимся, что массив уже существует
      const currentTagIds = Array.isArray(prev.selectedTags) ? prev.selectedTags : [];
      
      const newSelectedTags = currentTagIds.includes(tagId)
        ? currentTagIds.filter((id: string) => id !== tagId)
        : [...currentTagIds, tagId];
      
      console.log("Выбранные теги:", newSelectedTags);
      
      return {
        ...prev,
        selectedTags: newSelectedTags,
        formData: { ...prev.formData, tagIds: newSelectedTags }
      };
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setState((prev: any) => {
      // Убедимся, что массив уже существует
      const currentCategoryIds = Array.isArray(prev.selectedCategories) ? prev.selectedCategories : [];
      
      const newSelectedCategories = currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter((id: string) => id !== categoryId)
        : [...currentCategoryIds, categoryId];
      
      console.log("Выбранные категории:", newSelectedCategories);
      
      return {
        ...prev,
        selectedCategories: newSelectedCategories,
        formData: { ...prev.formData, categoryIds: newSelectedCategories }
      };
    });
  };

  const handleMoodSelect = (moodId: string) => {
    setState((prev: any) => {
      // Убедимся, что массив уже существует
      const currentMoodIds = Array.isArray(prev.selectedMoods) ? prev.selectedMoods : [];
      
      const newSelectedMoods = currentMoodIds.includes(moodId)
        ? currentMoodIds.filter((id: string) => id !== moodId)
        : [...currentMoodIds, moodId];
      
      console.log("Выбранные настроения:", newSelectedMoods);
      
      return {
        ...prev,
        selectedMoods: newSelectedMoods,
        formData: { ...prev.formData, moodIds: newSelectedMoods }
      };
    });
  };

  return {
    handleInputChange,
    handleEditorChange,
    handleTagSelect,
    handleCategorySelect,
    handleMoodSelect
  };
};
