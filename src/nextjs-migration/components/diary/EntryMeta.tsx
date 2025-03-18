
import React from 'react';
import { CalendarIcon, HeartIcon, TagIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface EntryMetaProps {
  entry: {
    createdAt: string;
    mood?: string;
    category?: string;
  };
}

const EntryMeta = ({ entry }: EntryMetaProps) => {
  return (
    <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
      <div className="flex items-center gap-1">
        <CalendarIcon className="h-4 w-4" />
        <span>{formatDate(entry.createdAt)}</span>
      </div>
      
      {entry.mood && (
        <div className="flex items-center gap-1">
          <HeartIcon className="h-4 w-4" />
          <span>{entry.mood}</span>
        </div>
      )}
      
      {entry.category && (
        <div className="flex items-center gap-1">
          <TagIcon className="h-4 w-4" />
          <span>{entry.category}</span>
        </div>
      )}
    </div>
  );
};

export default EntryMeta;
