
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiaryTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const DiaryTags = ({ tags, onTagClick }: DiaryTagsProps) => {
  return (
    <div className="bg-blog-yellow-light py-12">
      <div className="blog-container">
        <div className="flex items-center gap-2 mb-6">
          <Tag size={20} />
          <h2 className="text-xl font-bold">Популярные теги</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-white hover:bg-gray-100 text-blog-black cursor-pointer"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryTags;
