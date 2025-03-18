
import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface RelatedEntry {
  id: string;
  title: string;
  createdAt: string;
  shortDescription?: string;
  content?: string;
}

interface RelatedEntriesProps {
  entries: RelatedEntry[];
  isLoading?: boolean;
}

const RelatedEntries = ({ entries, isLoading = false }: RelatedEntriesProps) => {
  if (isLoading) {
    return <div className="animate-pulse">Loading related entries...</div>;
  }

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <h2 className="text-2xl font-bold mb-6">Похожие записи</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {entries.map(entry => (
          <Link href={`/diary/${entry.id}`} key={entry.id}>
            <div className="bg-white border border-gray-100 rounded-xl p-5 h-full hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{entry.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{formatDate(entry.createdAt)}</p>
              <p className="text-gray-700 line-clamp-3">
                {entry.shortDescription || entry.content?.substring(0, 120)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedEntries;
