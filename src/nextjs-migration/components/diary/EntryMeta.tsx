
import React from 'react';
import { formatDate } from '@/nextjs-migration/lib/utils';

interface EntryMetaProps {
  entry: {
    createdAt: string;
    category?: string;
    mood?: string;
  };
}

const EntryMeta = ({ entry }: EntryMetaProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
      <div className="flex items-center">
        <span>{formatDate(entry.createdAt)}</span>
      </div>

      {entry?.mood && (
        <div className="flex items-center">
          <span>{entry.mood}</span>
        </div>
      )}

      {entry?.category && (
        <div className="flex items-center">
          <span>{entry.category}</span>
        </div>
      )}
    </div>
  );
};

export default EntryMeta;
