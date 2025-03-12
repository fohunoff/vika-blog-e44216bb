
import { useState } from "react";
import { DiaryEntry } from "@/types/diary";
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
      createdAt: new Date().toISOString().split('T')[0],
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
        createdAt: new Date().toISOString().split('T')[0],
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
    // Гарантируем, что все поля - массивы
    const categoryIds = Array.isArray(entry.categoryIds) ? entry.categoryIds :
                        entry.categoryId ? [entry.categoryId] : [];

    const tagIds = Array.isArray(entry.tagIds) ? entry.tagIds : [];

    const moodIds = Array.isArray(entry.moodIds) ? entry.moodIds :
                    entry.moodId ? [entry.moodId] : [];

    // Отладочная информация
    console.log("Открытие диалога редактирования с записью:", entry);
    console.log("Подготовленные categoryIds:", categoryIds);
    console.log("Подготовленные tagIds:", tagIds);
    console.log("Подготовленные moodIds:", moodIds);

    setState({
      ...state,
      formData: {
        title: entry.title,
        content: entry.content,
        shortDescription: entry.shortDescription || '',
        imageSrc: entry.imageSrc || '',
        createdAt: entry.createdAt,
        categoryIds: categoryIds,
        tagIds: tagIds,
        moodIds: moodIds
      },
      selectedTags: tagIds,
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
