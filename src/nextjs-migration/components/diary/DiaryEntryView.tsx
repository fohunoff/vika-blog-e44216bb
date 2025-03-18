
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MessageSquare, Tag } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatters';
import { Badge } from '@/components/ui/badge';
import ClientEntryContent from './ClientEntryContent';
import EntryFooter from './EntryFooter';
import RelatedEntries from './RelatedEntries';
import { DiaryEntry } from '@/types/diary';

interface DiaryEntryViewProps {
  entry: DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  };
  relatedEntries: (DiaryEntry & {
    tags?: string[];
    category?: string;
    mood?: string;
  })[];
}

const DiaryEntryView = ({ entry, relatedEntries }: DiaryEntryViewProps) => {
  if (!entry) {
    console.error('No entry data provided to DiaryEntryView');
    return <div className="blog-container py-8">Запись не найдена</div>;
  }

  return (
    <article className="blog-container py-8 md:py-16">
      <Link href="/diary" className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
      </Link>
      
      {entry.imageSrc && (
        <div className="relative h-[300px] md:h-[500px] w-full mb-8 rounded-xl overflow-hidden">
          <Image
            src={entry.imageSrc}
            alt={entry.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
        <div className="flex items-center">
          <Calendar size={18} className="mr-2"/>
          <span>{formatDate(entry.createdAt)}</span>
        </div>

        {entry.mood && (
          <div className="flex items-center">
            <MessageSquare size={18} className="mr-2"/>
            <span>{entry.mood}</span>
          </div>
        )}

        {entry.category && (
          <div className="flex items-center">
            <Tag size={18} className="mr-2"/>
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
      
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {entry.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blog-yellow-light text-blog-black"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="my-8">
        {entry.content && <ClientEntryContent content={entry.content} />}
      </div>
      
      <EntryFooter updatedAt={entry.updatedAt} />
      
      {relatedEntries.length > 0 && (
        <section className="bg-gray-50 py-12 mt-12 -mx-4 md:-mx-8 px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-8">Похожие записи</h2>
          <RelatedEntries entries={relatedEntries} />
        </section>
      )}
    </article>
  );
};

export default DiaryEntryView;
