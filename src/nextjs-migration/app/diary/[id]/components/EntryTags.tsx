
import { Badge } from '@/components/ui/badge';

interface EntryTagsProps {
  tags: string[];
}

export default function EntryTags({ tags }: EntryTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-blog-yellow-light text-blog-black"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
