
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
      const newSelectedTags = prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id: string) => id !== tagId)
        : [...prev.selectedTags, tagId];
      
      return {
        ...prev,
        selectedTags: newSelectedTags,
        formData: { ...prev.formData, tagIds: newSelectedTags }
      };
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setState((prev: any) => {
      const newSelectedCategories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id: string) => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      
      // Directly set categoryIds as array
      return {
        ...prev,
        selectedCategories: newSelectedCategories,
        formData: { ...prev.formData, categoryIds: newSelectedCategories }
      };
    });
  };

  const handleMoodSelect = (moodId: string) => {
    setState((prev: any) => {
      const newSelectedMoods = prev.selectedMoods.includes(moodId)
        ? prev.selectedMoods.filter((id: string) => id !== moodId)
        : [...prev.selectedMoods, moodId];
      
      // Directly set moodIds as array
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
