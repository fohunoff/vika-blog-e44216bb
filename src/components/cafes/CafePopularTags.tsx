
import { MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface PopularTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const CafePopularTags = ({ tags, onTagClick }: PopularTagsProps) => {
  return (
    <div className="bg-blog-yellow-light py-12">
      <div className="blog-container">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} />
          <h2 className="text-xl font-bold">Популярные запросы</h2>
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

export default CafePopularTags;
