
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
