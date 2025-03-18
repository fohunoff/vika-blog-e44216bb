
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface DiaryTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void; // Made onTagClick optional with the ? symbol
}

const DiaryTags = ({ tags, onTagClick }: DiaryTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className={`bg-blog-yellow-light text-blog-black ${onTagClick ? 'cursor-pointer hover:bg-blog-yellow' : ''}`}
          onClick={() => onTagClick && onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default DiaryTags;
