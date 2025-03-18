
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/dateFormatters';
import { DiaryEntry } from '@/types/diary';

interface RelatedEntriesProps {
  entries: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  })[];
}

const RelatedEntries = ({ entries }: RelatedEntriesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <article 
          key={entry.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <Link href={`/diary/${entry.id}`} className="block">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={entry.imageSrc || '/placeholder.svg'}
                alt={entry.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
              <span>{formatDate(entry.createdAt)}</span>
              {entry.mood && <span>{entry.mood}</span>}
            </div>
            
            <Link href={`/diary/${entry.id}`}>
              <h3 className="font-bold mb-2 hover:text-blog-yellow transition-colors">
                {entry.title}
              </h3>
            </Link>
            
            {entry.shortDescription && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {entry.shortDescription}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default RelatedEntries;
