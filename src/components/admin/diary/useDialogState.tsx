
import { useState } from "react";
import { DiaryEntry } from "@/types/models";
import { DiaryFormState, DiaryDialogState } from "./types";

export const useDialogState = () => {
  const [state, setState] = useState<DiaryDialogState>({
    isDialogOpen: false,
    isDeleteDialogOpen: false,
    selectedEntry: null,
    selectedTags: [],
    selectedCategories: [],
    selectedMoods: [],
    formData: {
      title: '',
      content: '',
      shortDescription: '',
      imageSrc: '',
      date: new Date().toISOString().split('T')[0],
      categoryIds: [],
      tagIds: [],
      moodIds: []
    }
  });

  const setIsDialogOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isDialogOpen: isOpen }));
  };

  const setIsDeleteDialogOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isDeleteDialogOpen: isOpen }));
  };

  const openCreateDialog = () => {
    setState({
      ...state,
      formData: {
        title: '',
        content: '',
        shortDescription: '',
        imageSrc: '',
        date: new Date().toISOString().split('T')[0],
        categoryIds: [],
        tagIds: [],
        moodIds: []
      },
      selectedTags: [],
      selectedCategories: [],
      selectedMoods: [],
      selectedEntry: null,
      isDialogOpen: true
    });
  };

  const openEditDialog = (entry: DiaryEntry) => {
    const categoryIds = Array.isArray(entry.categoryIds) ? entry.categoryIds : [entry.categoryId];
    const moodIds = Array.isArray(entry.moodIds) ? entry.moodIds : [entry.moodId];
    
    setState({
      ...state,
      formData: {
        id: entry.id,
        title: entry.title,
        content: entry.content,
        shortDescription: entry.shortDescription || '',
        imageSrc: entry.imageSrc || '',
        date: entry.date,
        categoryIds: categoryIds,
        tagIds: Array.isArray(entry.tagIds) ? entry.tagIds : [],
        moodIds: moodIds
      },
      selectedTags: Array.isArray(entry.tagIds) ? entry.tagIds : [],
      selectedCategories: categoryIds,
      selectedMoods: moodIds,
      selectedEntry: entry.id,
      isDialogOpen: true
    });
  };

  const openDeleteDialog = (entryId: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedEntry: entryId,
      isDeleteDialogOpen: true 
    }));
  };

  return {
    ...state,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    setState
  };
};
