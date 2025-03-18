
import { DiaryEntry } from '@/types/diary';
import EntryHeader from '@/nextjs-migration/components/diary/EntryHeader';
import EntryMeta from '@/nextjs-migration/components/diary/EntryMeta';
import EntryDescription from '@/nextjs-migration/components/diary/EntryDescription';
import ClientEntryContent from '@/nextjs-migration/components/diary/ClientEntryContent';
import EntryFooter from '@/nextjs-migration/components/diary/EntryFooter';
import RelatedEntries from '@/nextjs-migration/components/diary/RelatedEntries';
import EntryTags from './EntryTags';
import EntryTitle from './EntryTitle';

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

export default function DiaryEntryView({ entry, relatedEntries }: DiaryEntryViewProps) {
  // Ensure we have the entry data to display
  if (!entry) {
    console.error('No entry data provided to DiaryEntryView');
    return <div>Запись не найдена</div>;
  }

  return (
    <article className="blog-container py-8 md:py-16">
      <EntryHeader 
        entryImage={entry.imageSrc} 
        title={entry.title} 
      />
      
      <EntryMeta 
        createdAt={entry.createdAt}
        mood={entry.mood}
        category={entry.category}
      />
      
      <EntryTitle title={entry.title} />
      
      {entry.shortDescription && (
        <EntryDescription description={entry.shortDescription} />
      )}
      
      {entry.tags && entry.tags.length > 0 && (
        <EntryTags tags={entry.tags} />
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
}
