
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DiaryEntry } from '@/types/diary';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import EntryHeader from '@/nextjs-migration/components/diary/EntryHeader';
import EntryMeta from '@/nextjs-migration/components/diary/EntryMeta';
import EntryDescription from '@/nextjs-migration/components/diary/EntryDescription';
import ClientEntryContent from '@/nextjs-migration/components/diary/ClientEntryContent';
import EntryFooter from '@/nextjs-migration/components/diary/EntryFooter';
import RelatedEntries from '@/nextjs-migration/components/diary/RelatedEntries';
import { Badge } from '@/components/ui/badge';

// Use this function to generate metadata for the page (SEO)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/diary/entries/${params.id}`, { next: { revalidate: 60 } });
    
    if (!response.ok) {
      return { title: 'Запись не найдена | Дневник' };
    }
    
    const entry = await response.json();
    
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
    return { title: 'Ошибка загрузки | Дневник' };
  }
}

// Server component for fetching data and rendering the diary entry
export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  try {
    const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
    
    // Fetch the diary entry
    const entryResponse = await fetch(`${API_BASE_URL}/diary/entries/${params.id}`, { next: { revalidate: 60 } });
    
    if (!entryResponse.ok) {
      notFound();
    }
    
    const entryData = await entryResponse.json();
    
    // Fetch categories, tags, and moods
    const [categoriesResponse, tagsResponse, moodsResponse, allEntriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/diary/categories`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/tags`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/moods`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/diary/entries/enriched`, { next: { revalidate: 60 } })
    ]);
    
    const categories = await categoriesResponse.json();
    const tags = await tagsResponse.json();
    const moods = await moodsResponse.json();
    const allEntries = await allEntriesResponse.json();
    
    // Normalize array data
    const tagIds = Array.isArray(entryData.tagIds) ? entryData.tagIds :
                  (entryData.tagIds ? [entryData.tagIds] : []);
                  
    const categoryIds = Array.isArray(entryData.categoryIds) ? entryData.categoryIds :
                      [entryData.categoryId || entryData.categoryIds].filter(Boolean);
    
    const moodIds = Array.isArray(entryData.moodIds) ? entryData.moodIds :
                   [entryData.moodId || entryData.moodIds].filter(Boolean);
    
    // Get related metadata
    const categoryData = categoryIds.map(categoryId => 
      categories.find((category: any) => category.id === categoryId)
    ).filter(Boolean);
    
    const tagsData = tagIds.map(tagId => 
      tags.find((tag: any) => tag.id === tagId)
    ).filter(Boolean);
    
    const moodData = moodIds.map(moodId => 
      moods.find((mood: any) => mood.id === moodId)
    ).filter(Boolean);
    
    // Enhance entry with metadata
    const entry = {
      ...entryData,
      tags: tagsData.filter(Boolean).map((tag: any) => tag?.name),
      category: categoryData.filter(Boolean).find((category: any) => category)?.name,
      mood: moodData.filter(Boolean).find((mood: any) => mood)?.name
    };
    
    // Find related entries
    const relatedEntries = allEntries
      .filter((e: any) => e.id !== params.id)
      .filter((e: any) => {
        const sameCategory = e.category === entry.category;
        const hasMatchingTag = e.tags?.some((tag: string) => entry.tags?.includes(tag));
        return sameCategory || hasMatchingTag;
      })
      .slice(0, 3);
    
    return (
      <MainLayout>
        <article className="blog-container py-8 md:py-16">
          <Link href="/diary" className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
          </Link>
          
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
          
          {entry.shortDescription && (
            <EntryDescription description={entry.shortDescription} />
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {entry.tags.map((tag: string, index: number) => (
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
      </MainLayout>
    );
  } catch (error) {
    console.error('Error in DiaryEntryPage:', error);
    notFound();
  }
}
