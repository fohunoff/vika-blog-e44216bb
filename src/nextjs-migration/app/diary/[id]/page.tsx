
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDiaryEntry, getRelatedEntries } from '@/nextjs-migration/services/diary';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import DiaryEntryView from '@/nextjs-migration/components/diary/DiaryEntryView';

// Генерация метаданных для страницы (SEO)
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

// Серверный компонент для получения данных и рендеринга страницы дневника
export default async function DiaryEntryPage({ params }: { params: { id: string } }) {
  try {
    // Получаем запись полностью на сервере
    const entry = await getDiaryEntry(params.id);
    
    if (!entry) {
      notFound();
    }
    
    // Получаем связанные записи на сервере
    const relatedEntries = await getRelatedEntries(params.id, entry);
    
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
