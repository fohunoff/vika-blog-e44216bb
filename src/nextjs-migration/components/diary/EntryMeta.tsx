
import { Calendar, MessageSquare, Tag } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatters';

interface EntryMetaProps {
  entry: {
    createdAt: string;
    mood?: string;
    category?: string;
  };
}

// Support direct props interface for backward compatibility
interface DirectEntryMetaProps {
  createdAt: string;
  mood?: string;
  category?: string;
}

const EntryMeta = (props: EntryMetaProps | DirectEntryMetaProps) => {
  // Check which interface we're using
  const isDirectProps = 'createdAt' in props;
  
  let createdAt: string, mood: string | undefined, category: string | undefined;
  
  if (isDirectProps) {
    const directProps = props as DirectEntryMetaProps;
    createdAt = directProps.createdAt;
    mood = directProps.mood;
    category = directProps.category;
  } else {
    const { entry } = props as EntryMetaProps;
    createdAt = entry.createdAt;
    mood = entry.mood;
    category = entry.category;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
      <div className="flex items-center">
        <Calendar size={18} className="mr-2"/>
        <span>{formatDate(createdAt)}</span>
      </div>

      {mood && (
        <div className="flex items-center">
          <MessageSquare size={18} className="mr-2"/>
          <span>{mood}</span>
        </div>
      )}

      {category && (
        <div className="flex items-center">
          <Tag size={18} className="mr-2"/>
          <span>{category}</span>
        </div>
      )}
    </div>
  );
};

export default EntryMeta;
