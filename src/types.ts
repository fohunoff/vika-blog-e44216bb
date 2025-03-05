
export interface Recipe {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: Category;
  time: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  imageSrc: string;
  servings?: number;
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
}

export interface Tag {
  id: string;
  name: string;
}
