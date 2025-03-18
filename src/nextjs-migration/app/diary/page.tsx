
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  getAllDiaryEntries, 
  getDiaryMoods, 
  getDiaryCategories, 
  getDiaryTags 
} from '@/nextjs-migration/services/diary';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import DiaryEntryList from '@/nextjs-migration/components/diary/DiaryEntryList';
import DiarySearchHeader from '@/nextjs-migration/components/diary/DiarySearchHeader';
import DiarySidebar from '@/nextjs-migration/components/diary/DiarySidebar';

export const metadata: Metadata = {
  title: 'Дневник | Личные записи',
  description: 'Мой личный дневник. Мысли, впечатления и заметки о разных моментах жизни.',
};

export default async function DiaryPage() {
  // Получаем данные с сервера
  const [entries, moods, categories, tags] = await Promise.all([
    getAllDiaryEntries(),
    getDiaryMoods(),
    getDiaryCategories(),
    getDiaryTags()
  ]);

  return (
    <MainLayout>
      <section className="blog-container py-8 md:py-16">
        <DiarySearchHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <DiarySidebar 
              moods={moods} 
              categories={categories} 
              tags={tags} 
            />
          </div>
          
          <div className="md:col-span-3">
            <DiaryEntryList entries={entries} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
