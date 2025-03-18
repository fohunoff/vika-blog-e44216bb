
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { DiaryEntry } from '@/types/diary';

interface RelatedEntriesProps {
  entries: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  })[];
}

const RelatedEntries = ({ entries }: RelatedEntriesProps) => {
  if (entries.length === 0) return null;
  
  return (
    <section className="bg-gray-50 py-12">
      <div className="blog-container">
        <h2 className="text-2xl font-bold mb-8">Похожие записи</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {entries.map((relatedEntry) => (
            <Link
              key={relatedEntry.id}
              href={`/diary/${relatedEntry.id}`}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{relatedEntry.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{formatDate(relatedEntry.createdAt)}</p>
              <p className="line-clamp-3 text-gray-700">
                {relatedEntry.shortDescription || relatedEntry.content.substring(0, 120)}...
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedEntries;
