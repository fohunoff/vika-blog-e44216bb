
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { getDiaryEntryById, getDiaryCategories, getDiaryTags, getDiaryMoods, getEnrichedDiaryEntries } from '@/lib/api';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import EntryContent from '@/components/diary/EntryContent';
import EntryHeader from '@/components/diary/EntryHeader';
import EntryMeta from '@/components/diary/EntryMeta';
import EntryDescription from '@/components/diary/EntryDescription';
import EntryFooter from '@/components/diary/EntryFooter';
import RelatedEntries from '@/components/diary/RelatedEntries';
import DiaryTags from '@/components/diary/DiaryTags';

// Define types for page params and searchParams
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate metadata for the page (for SEO)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch diary entry
  const entry = await getDiaryEntryById(params.id);
  
  if (!entry) {
    return {
      title: 'Запись не найдена | Дневник',
      description: 'Запрашиваемая запись не существует'
    };
  }

  return {
    title: `${entry.title} | Дневник`,
    description: entry.shortDescription || `Запись дневника: ${entry.title}`,
    openGraph: {
      title: entry.title,
      description: entry.shortDescription || `Запись дневника: ${entry.title}`,
      images: entry.imageSrc ? [entry.imageSrc] : undefined
    },
  };
}

// Main page component
export default async function DiaryEntryPage({ params }: Props) {
  // Fetch data using server-side data fetching
  try {
    // Get the diary entry
    const entry = await getDiaryEntryById(params.id);
    
    if (!entry) {
      notFound();
    }

    // Prepare arrays for metadata lookup
    const tagIds = Array.isArray(entry.tagIds) ? entry.tagIds : 
                  (entry.tagIds ? [entry.tagIds] : []);
    
    const categoryIds = Array.isArray(entry.categoryIds) ? entry.categoryIds :
                      [entry.categoryId || entry.categoryIds].filter(Boolean);
    
    const moodIds = Array.isArray(entry.moodIds) ? entry.moodIds :
                   [entry.moodId || entry.moodIds].filter(Boolean);

    // Fetch all metadata in parallel
    const [categories, tags, moods, allEntries] = await Promise.all([
      getDiaryCategories(),
      getDiaryTags(),
      getDiaryMoods(),
      getEnrichedDiaryEntries()
    ]);

    // Get associated metadata
    const categoryData = categoryIds
      .map(categoryId => categories.find(category => category.id === categoryId))
      .filter(Boolean);
    
    const tagsData = tagIds
      .map(tagId => tags.find(tag => tag.id === tagId))
      .filter(Boolean);
    
    const moodData = moodIds
      .map(moodId => moods.find(mood => mood.id === moodId))
      .filter(Boolean);

    // Enrich the entry with metadata
    const enrichedEntry = {
      ...entry,
      tags: tagsData.map((tag: any) => tag?.name),
      category: categoryData.find((category: any) => category)?.name,
      mood: moodData.find((mood: any) => mood)?.name
    };

    // Find related entries
    const relatedEntries = allEntries
      .filter(e => e.id !== params.id)
      .filter(e => {
        const sameCategory = e.category === enrichedEntry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => enrichedEntry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3);

    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />

        <article className="blog-container py-8 md:py-16">
          <EntryHeader 
            entryImage={enrichedEntry.imageSrc} 
            title={enrichedEntry.title} 
          />

          <EntryMeta entry={enrichedEntry} />

          <EntryDescription
            title={enrichedEntry.title}
            shortDescription={enrichedEntry.shortDescription}
            tags={enrichedEntry.tags}
          />

          <div className="my-8">
            {enrichedEntry.content && (
              <EntryContent content={enrichedEntry.content} />
            )}
          </div>

          <EntryFooter updatedAt={enrichedEntry.updatedAt} />
        </article>

        <RelatedEntries entries={relatedEntries} />

        <DiaryTags tags={enrichedEntry.tags || []} />

        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Error fetching entry:', error);

    return (
      <main className="min-h-screen pt-24">
        <BlogHeader />
        <div className="blog-container py-16 text-center">
          <h1 className="section-title mb-4">Ошибка загрузки</h1>
          <p className="mb-8">Не удалось загрузить запись дневника. Пожалуйста, попробуйте позже.</p>
          <Link href="/diary">
            <div className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80 py-2 px-4 rounded flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к дневнику
            </div>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }
}
