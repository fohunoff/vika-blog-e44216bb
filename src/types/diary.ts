
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
  categoryId?: string;
  categoryIds: string[]; // Всегда массив
  tagIds: string[];
  moodId?: string;
  moodIds: string[]; // Всегда массив
}

export interface DiaryEntryFormData {
  id?: string;
  title: string;
  content: string;
  shortDescription: string;
  imageSrc: string;
  date: string;
  categoryIds: string[]; // Всегда массив
  tagIds: string[];
  moodIds: string[]; // Всегда массив
}
