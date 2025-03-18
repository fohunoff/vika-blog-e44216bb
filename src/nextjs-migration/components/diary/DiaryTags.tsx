
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

interface DiaryTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const DiaryTags = ({ tags, onTagClick }: DiaryTagsProps) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <section className="blog-container py-10 border-t border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Теги</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-blog-yellow-light text-blog-black hover:bg-blog-yellow transition-colors cursor-pointer"
            onClick={() => onTagClick && onTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export default DiaryTags;
