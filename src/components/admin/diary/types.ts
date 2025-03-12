
export interface DiaryFormState {
  title: string;
  content: string;
  shortDescription: string;
  imageSrc: string;
  createdAt: string;
  categoryIds: string[];
  tagIds: string[];
  moodIds: string[];
}

export interface DiaryDialogState {
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedEntry: string | null;
  selectedTags: string[];
  selectedCategories: string[];
  selectedMoods: string[];
  formData: DiaryFormState;
}
