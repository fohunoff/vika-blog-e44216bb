
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
