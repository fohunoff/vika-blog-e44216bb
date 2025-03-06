
export interface HomeCategory {
  id: string;
  name: string;
  image: string;
}

export interface HomeTag {
  id: string;
  name: string;
}

export interface HomeHighlightType {
  id: string;
  name: string;
}

export interface HomeArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
  tags: string[];
  isHighlight: boolean;
  typeId: string | null;
  type: string | null;
}

export interface HomeHighlight extends HomeArticle {
  typeId: string;
  type: string;
  isHighlight: true;
}

export interface HomeFeaturedSection {
  id: string;
  title: string;
  description: string;
  type: string;
}

// Recipe Models
export interface RecipeCategory {
  id: string;
  name: string;
  image?: string;
}

export interface RecipeTag {
  id: string;
  name: string;
}

export interface RecipeDifficultyLevel {
  id: string;
  name: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  imageSrc: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  categoryId: string;
  tagIds: string[];
  date: string;
}

// Cafe Models
export interface CafeCategory {
  id: string;
  name: string;
  image?: string;
}

export interface CafeTag {
  id: string;
  name: string;
}

export interface CafePriceRange {
  id: string;
  name: string;
  description: string;
}

export interface Cafe {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  imageSrc: string;
  location: string;
  openHours?: string;
  priceRange: string;
  rating: number;
  categoryIds: string[];
  tagIds: string[];
  website?: string;
  phone?: string;
  address?: string;
}

// Diary Models
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
  categoryId: string;
  tagIds: string[];
  moodId: string;
}

// User Models
export interface UserPreference {
  id: string;
  name: string;
  type: string;
  value: string;
  isEnabled: boolean;
}

// Comment Models
export interface CommentType {
  id: string;
  name: string;
  icon: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  date: string;
  typeId: string;
  parentId?: string;
  targetType: 'article' | 'recipe' | 'cafe' | 'diary';
  targetId: string;
}
