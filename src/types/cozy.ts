
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
