
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateFormatters';
import { DiaryEntry } from '@/types/diary';
import ClientEntryContent from './ClientEntryContent';
import RelatedEntries from './RelatedEntries';

// Types for component
interface DiaryEntryViewProps {
  entry: (DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  });
  relatedEntries: (DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[];
}

const DiaryEntryView = ({ entry, relatedEntries }: DiaryEntryViewProps) => {
  return (
    <section className="blog-container py-8 md:py-16">
      <Link href="/diary" className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
      </Link>

      <article>
        {entry.imageSrc && (
          <div className="relative h-[300px] md:h-[500px] w-full mb-8 rounded-xl overflow-hidden">
            <img
              src={entry.imageSrc}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

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

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>

        {entry.shortDescription && (
          <p className="text-xl text-gray-700 mb-8 font-serif italic">
            {entry.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {entry.tags && entry.tags.length > 0 && entry.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blog-yellow-light text-blog-black"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="my-8">
          <ClientEntryContent content={entry.content || ''} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 text-sm">
          <div className="flex items-center">
            <span>Отредактировано: {formatDate(entry.updatedAt)}</span>
          </div>
        </div>
      </article>

      {relatedEntries.length > 0 && (
        <section className="bg-gray-50 py-12 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 mt-12">
          <div>
            <h2 className="text-2xl font-bold mb-8">Похожие записи</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEntries.map((relatedEntry) => (
                <Link
                  key={relatedEntry.id}
                  href={`/diary/${relatedEntry.id}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{relatedEntry.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{formatDate(relatedEntry.createdAt)}</p>
                  <p className="line-clamp-3 text-gray-700">
                    {relatedEntry.shortDescription || relatedEntry.content?.substring(0, 120) + '...'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </section>
  );
};

export default DiaryEntryView;
