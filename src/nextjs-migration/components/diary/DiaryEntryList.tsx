
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatters';
import { DiaryEntry } from '@/types/diary';

interface DiaryEntryListProps {
  entries: (DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[];
}

const DiaryEntryList = ({ entries }: DiaryEntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold mb-2">Записи не найдены</h3>
        <p className="text-gray-600">
          Попробуйте изменить параметры поиска или выбрать другое настроение.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {entries.map((entry) => (
        <article key={entry.id} className="border-b pb-16 last:border-b-0">
          {entry.imageSrc && (
            <Link href={`/diary/${entry.id}`} className="block mb-6">
              <div className="relative h-72 w-full rounded-lg overflow-hidden">
                <Image
                  src={entry.imageSrc}
                  alt={entry.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
            </Link>
          )}
          
          <div className="flex items-center gap-4 text-gray-500 mb-4">
            <span>{formatDate(entry.createdAt)}</span>
            {entry.mood && <span>• {entry.mood}</span>}
            {entry.category && <span>• {entry.category}</span>}
          </div>
          
          <Link href={`/diary/${entry.id}`}>
            <h2 className="text-2xl font-bold mb-4 hover:text-blog-yellow transition-colors">
              {entry.title}
            </h2>
          </Link>
          
          {entry.shortDescription && (
            <p className="text-gray-700 mb-6">
              {entry.shortDescription}
            </p>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {entry.tags.map((tag, idx) => (
                <span 
                  key={`${entry.id}-tag-${idx}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <Link 
            href={`/diary/${entry.id}`}
            className="inline-block text-blog-yellow font-medium hover:underline"
          >
            Читать полностью
          </Link>
        </article>
      ))}
    </div>
  );
};

export default DiaryEntryList;
