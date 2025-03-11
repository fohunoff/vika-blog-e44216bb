
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
      // Ensure we always work with arrays
      const currentTags = Array.isArray(prev.selectedTags) ? prev.selectedTags : [];
      
      const newSelectedTags = currentTags.includes(tagId)
        ? currentTags.filter((id: string) => id !== tagId)
        : [...currentTags, tagId];
      
      return {
        ...prev,
        selectedTags: newSelectedTags,
        formData: { ...prev.formData, tagIds: newSelectedTags }
      };
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setState((prev: any) => {
      // Ensure we always work with arrays
      const currentCategories = Array.isArray(prev.selectedCategories) ? prev.selectedCategories : [];
      
      const newSelectedCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter((id: string) => id !== categoryId)
        : [...currentCategories, categoryId];
      
      return {
        ...prev,
        selectedCategories: newSelectedCategories,
        formData: { ...prev.formData, categoryIds: newSelectedCategories }
      };
    });
  };

  const handleMoodSelect = (moodId: string) => {
    setState((prev: any) => {
      // Ensure we always work with arrays
      const currentMoods = Array.isArray(prev.selectedMoods) ? prev.selectedMoods : [];
      
      const newSelectedMoods = currentMoods.includes(moodId)
        ? currentMoods.filter((id: string) => id !== moodId)
        : [...currentMoods, moodId];
      
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
