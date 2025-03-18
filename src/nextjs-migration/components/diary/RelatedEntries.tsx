
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatters';
import { DiaryEntry } from '@/types/diary';

interface RelatedEntriesProps {
  entries: (DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[];
}

const RelatedEntries = ({ entries }: RelatedEntriesProps) => {
  if (!entries || entries.length === 0) return null;
  
  return (
    <section className="bg-gray-50 py-12 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 mt-12">
      <div>
        <h2 className="text-2xl font-bold mb-8">Похожие записи</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/diary/${entry.id}`}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{entry.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{formatDate(entry.createdAt)}</p>
              <p className="line-clamp-3 text-gray-700">
                {entry.shortDescription || entry.content?.substring(0, 120) + '...'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedEntries;
