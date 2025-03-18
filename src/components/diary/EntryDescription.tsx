
import { Badge } from '@/components/ui/badge';

interface EntryDescriptionProps {
  title: string;
  shortDescription?: string;
  tags?: string[];
}

const EntryDescription = ({ title, shortDescription, tags }: EntryDescriptionProps) => {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>

      {shortDescription && (
        <p className="text-xl text-gray-700 mb-8 font-serif italic">
          {shortDescription}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {tags && tags.length > 0 && tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-blog-yellow-light text-blog-black"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default EntryDescription;
