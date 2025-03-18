
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import DiaryTags from '@/nextjs-migration/components/diary/DiaryTags';
import EntryMeta from '@/nextjs-migration/components/diary/EntryMeta';
import EntryFooter from '@/nextjs-migration/components/diary/EntryFooter';
import EntryHeader from '@/nextjs-migration/components/diary/EntryHeader';
import EntryDescription from '@/nextjs-migration/components/diary/EntryDescription';
import RelatedEntries from '@/nextjs-migration/components/diary/RelatedEntries';
import ClientEntryContent from '@/nextjs-migration/components/diary/ClientEntryContent';
import { 
  getDiaryEntryById, 
  getDiaryCategories, 
  getDiaryTags, 
  getDiaryMoods, 
  getEnrichedDiaryEntries,
  enrichEntryWithMetadata,
  findRelatedEntries
} from '@/nextjs-migration/services/diaryService';

// Generate metadata for the entry
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const entry = await getDiaryEntryById(params.id);
    
    if (!entry) {
      return {
        title: 'Запись не найдена | Дневник',
        description: 'К сожалению, запрашиваемая запись дневника не существует.',
      };
    }
    
    return {
      title: `${entry.title} | Дневник`,
      description: entry.shortDescription || `Запись дневника: ${entry.title}`,
      openGraph: {
        title: entry.title,
        description: entry.shortDescription || `Запись дневника: ${entry.title}`,
        images: entry.imageSrc ? [{ url: entry.imageSrc }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Дневник | Личные записи',
      description: 'Мой личный дневник. Мысли, впечатления и заметки о разных моментах жизни.',
    };
  }
}

// Main page component
export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Fetch all necessary data from the server
  const [entryData, categories, tags, moods, allEntries] = await Promise.all([
    getDiaryEntryById(id),
    getDiaryCategories(),
    getDiaryTags(),
    getDiaryMoods(),
    getEnrichedDiaryEntries()
  ]);
  
  // If entry not found, return 404
  if (!entryData) {
    notFound();
  }
  
  // Enrich entry with metadata
  const entry = enrichEntryWithMetadata(entryData, categories, tags, moods);

  // Find related entries
  const relatedEntries = findRelatedEntries(allEntries, id, entry);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <article className="blog-container py-8 md:py-16">
        <EntryHeader 
          entryImage={entry.imageSrc} 
          title={entry.title} 
        />

        <EntryMeta entry={entry} />

        <h1 className="text-3xl md:text-4xl font-bold mb-6">{entry.title}</h1>

        {entry.shortDescription && (
          <p className="text-xl text-gray-700 mb-8 font-serif italic">
            {entry.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {entry.tags && entry.tags.length > 0 && (
            <DiaryTags tags={entry.tags} />
          )}
        </div>

        <div className="my-8">
          {entry.content && <ClientEntryContent content={entry.content}/>}
        </div>

        <EntryFooter updatedAt={entry.updatedAt} />
      </article>

      {relatedEntries.length > 0 && (
        <RelatedEntries entries={relatedEntries} />
      )}

      <Footer />
    </main>
  );
}
