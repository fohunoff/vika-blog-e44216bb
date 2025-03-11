export interface MainFeaturedSection {
  id: string;
  title: string;
  description: string;
  type: string;
}

// Cozy Models
export interface CozyCategory {
  id: string;
  name: string;
  image?: string;
}

export interface CozyTag {
  id: string;
  name: string;
}

export interface CozyHighlightType {
  id: string;
  name: string;
}

export interface CozyArticle {
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

export interface CozyHighlight extends CozyArticle {
  typeId: string;
  type: string;
  isHighlight: true;
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
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  ingredients: {
    name: string;
    amount: string;
  }[];
  steps: string[];
  categoryId: string;
  tagIds: string[];
  publishDate?: string;
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
  categoryIds?: string[]; // Added for multi-select
  tagIds: string[];
  moodId: string;
  moodIds?: string[]; // Added for multi-select
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

// Main Models
export interface HeroData {
  tagline: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  mainImage: {
    src: string;
    alt: string;
  };
  badge: {
    text: string;
  };
  imageCaption: {
    title: string;
    subtitle: string;
  };
}

export interface AboutData {
  title: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

export interface NewsletterData {
  title: string;
  description: string;
  inputPlaceholder: string;
  successMessage: string;
}

export interface LatestPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  link: string;
}
