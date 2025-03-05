
import { Badge } from "@/components/ui/badge";

interface PopularTagsSectionProps {
  tags: string[];
}

const PopularTagsSection = ({ tags }: PopularTagsSectionProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Популярные темы</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index}
            className="bg-blog-gray text-gray-700 hover:bg-blog-yellow hover:text-blog-black cursor-pointer px-3 py-1.5"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PopularTagsSection;
