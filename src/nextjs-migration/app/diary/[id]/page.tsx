
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDiaryEntry, getRelatedEntries } from '@/nextjs-migration/services/diaryService';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import DiaryEntryView from './components/DiaryEntryView';

// Use this function to generate metadata for the page (SEO)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const entry = await getDiaryEntry(params.id);
    
    if (!entry) {
      return { title: 'Запись не найдена | Дневник' };
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
    return { title: 'Ошибка загрузки | Дневник' };
  }
}

// Server component for fetching data and rendering the diary entry
export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  console.log('Fetching diary entry with ID:', params.id);
  
  try {
    // Fetch the diary entry
    const entry = await getDiaryEntry(params.id);
    
    console.log('Fetched entry:', entry ? 'Found' : 'Not found');
    
    if (!entry) {
      notFound();
    }
    
    // Fetch related entries
    const relatedEntries = await getRelatedEntries(params.id, entry);
    
    console.log('Fetched related entries:', relatedEntries.length);
    
    return (
      <MainLayout>
        <DiaryEntryView entry={entry} relatedEntries={relatedEntries} />
      </MainLayout>
    );
  } catch (error) {
    console.error('Error in DiaryEntryPage:', error);
    notFound();
  }
}
