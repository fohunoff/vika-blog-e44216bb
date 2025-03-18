
import { Calendar, MessageSquare, Tag } from 'lucide-react';
import { DiaryEntry } from '@/types/models';
import { formatDate } from '@/utils/dateFormatters';

interface EntryMetaProps {
  entry: DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  };
}

const EntryMeta = ({ entry }: EntryMetaProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
      <div className="flex items-center">
        <Calendar size={18} className="mr-2"/>
        <span>{formatDate(entry.createdAt)}</span>
      </div>

      {entry?.mood && (
        <div className="flex items-center">
          <MessageSquare size={18} className="mr-2"/>
          <span>{entry.mood}</span>
        </div>
      )}

      {entry?.category && (
        <div className="flex items-center">
          <Tag size={18} className="mr-2"/>
          <span>{entry.category}</span>
        </div>
      )}
    </div>
  );
};

export default EntryMeta;
