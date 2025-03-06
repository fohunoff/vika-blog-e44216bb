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
