
export interface DiaryCategory {
  id: string;
  name: string;
  image?: string;
}

export interface DiaryTag {
  id: string;
  name: string;
}

export interface DiaryMood {
  id: string;
  name: string;
  icon?: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  shortDescription?: string;
  imageSrc?: string;
  date: string;
  categoryId?: string; // Legacy field, kept for backward compatibility
  categoryIds: string[]; // Always an array
  tagIds: string[]; // Always an array
  moodId?: string; // Legacy field, kept for backward compatibility
  moodIds: string[]; // Always an array
}

// The form data should match the entry structure exactly
export interface DiaryEntryFormData {
  id?: string;
  title: string;
  content: string;
  shortDescription: string;
  imageSrc: string;
  date: string;
  categoryIds: string[]; // Always an array
  tagIds: string[]; // Always an array
  moodIds: string[]; // Always an array
}
