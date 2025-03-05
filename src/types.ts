export interface Recipe {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: ICategory;
  time: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  imageSrc: string;
  servings?: number;
  tags: ITag[];
}

export interface ICategory {
  id: string;
  name: string;
  displayName: string;
}

export interface ITag {
  id: string;
  name: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  mood: string;
  tags: string[];
  imageSrc?: string;
}

export interface DiaryMood {
  id: string;
  name: string;
}
