
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiaryEntry } from '@/types/diary';
import { formatDate } from '@/nextjs-migration/lib/utils';
import { Badge } from '@/nextjs-migration/components/ui/badge';
import EntryHeader from '@/nextjs-migration/components/diary/EntryHeader';
import EntryMeta from '@/nextjs-migration/components/diary/EntryMeta';
import EntryDescription from '@/nextjs-migration/components/diary/EntryDescription';
import ClientEntryContent from '@/nextjs-migration/components/diary/ClientEntryContent';
import EntryFooter from '@/nextjs-migration/components/diary/EntryFooter';
import RelatedEntries from '@/nextjs-migration/components/diary/RelatedEntries';
import DiaryTags from '@/nextjs-migration/components/diary/DiaryTags';
import { getDiaryEntry, getRelatedEntries } from '@/nextjs-migration/services/diaryService';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const entry = await getDiaryEntry(params.id);
    if (!entry) return { title: 'Запись не найдена | Дневник' };
    
    return {
      title: `${entry.title} | Дневник`,
      description: entry.shortDescription || `Запись дневника: ${entry.title}`,
    };
  } catch (error) {
    return { title: 'Ошибка загрузки | Дневник' };
  }
}

export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  try {
    const entry = await getDiaryEntry(params.id);
    
    if (!entry) {
      notFound();
    }
    
    const relatedEntries = await getRelatedEntries(params.id, entry);

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
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>
        
        <EntryDescription description={entry.shortDescription} />

        {entry.tags && entry.tags.length > 0 && (
          <DiaryTags tags={entry.tags} />
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
  } catch (error) {
    console.error('Error in DiaryEntryPage:', error);
    notFound();
  }
}
