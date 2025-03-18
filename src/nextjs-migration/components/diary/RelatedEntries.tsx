
import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface RelatedEntryProps {
  id: string;
  title: string;
  createdAt: string;
  shortDescription?: string;
}

interface RelatedEntriesProps {
  entries: RelatedEntryProps[];
}

const RelatedEntries = ({ entries }: RelatedEntriesProps) => {
  if (!entries || entries.length === 0) return null;
  
  return (
    <section className="blog-container py-10 border-t border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Похожие записи</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 border border-gray-100 rounded hover:border-gray-300 transition-colors">
            <Link href={`/diary/${entry.id}`}>
              <div className="mb-2 font-medium hover:text-blue-600 transition-colors">
                {entry.title}
              </div>
            </Link>
            
            <div className="text-sm text-gray-500">
              {formatDate(entry.createdAt)}
            </div>
            
            {entry.shortDescription && (
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                {entry.shortDescription}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedEntries;
