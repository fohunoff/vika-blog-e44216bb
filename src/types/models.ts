
// Common interfaces
export interface BaseCategory {
  id: string;
  name: string;
}

export interface BaseTag {
  id: string;
  name: string;
}

// Home models
export interface HomeHighlight {
  id: string;
  title: string;
  content: string;
  image: string;
  typeId: string;
  type: string;
}

export interface HomeHighlightType {
  id: string;
  name: string;
}

export interface HomeCategory extends BaseCategory {}
export interface HomeTag extends BaseTag {}

// Recipe models
export interface RecipeCategory extends BaseCategory {}
export interface RecipeTag extends BaseTag {}

// Diary models
export interface DiaryCategory extends BaseCategory {}
export interface DiaryTag extends BaseTag {}

export interface DiaryEntry {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  date: string;
  moodId: string;
  imageSrc: string;
  categoryId: string;
  tagIds: string[];
}

// Cafe models
export interface CafeCategory extends BaseCategory {}
export interface CafeTag extends BaseTag {}

export interface CafeReview {
  author: string;
  text: string;
  date: string;
  rating: number;
}

export interface Cafe {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  shortDescription: string;
  description: string;
  categoryIds: string[];
  tagIds: string[];
  imageSrc: string;
  openHours: string;
  reviews: CafeReview[];
}

// Article models
export interface ArticleCategory extends BaseCategory {}
export interface ArticleTag extends BaseTag {}
