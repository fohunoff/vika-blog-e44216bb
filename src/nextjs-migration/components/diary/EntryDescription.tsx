
import { Badge } from '@/components/ui/badge';

interface EntryDescriptionProps {
  title: string;
  shortDescription?: string;
  tags?: string[];
}

// Support legacy interface for backward compatibility
interface LegacyEntryDescriptionProps {
  description: string;
}

const EntryDescription = (props: EntryDescriptionProps | LegacyEntryDescriptionProps) => {
  // Check if using legacy props
  const isLegacyProps = 'description' in props;
  
  if (isLegacyProps) {
    const { description } = props as LegacyEntryDescriptionProps;
    return (
      <p className="text-xl text-gray-700 mb-8 font-serif italic">
        {description}
      </p>
    );
  }
  
  // Using new props interface
  const { title, shortDescription, tags } = props as EntryDescriptionProps;
  
  return (
    <>
      {title && <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>}

      {shortDescription && (
        <p className="text-xl text-gray-700 mb-8 font-serif italic">
          {shortDescription}
        </p>
      )}

      {tags && tags.length > 0 && (
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
      )}
    </>
  );
};

export default EntryDescription;
