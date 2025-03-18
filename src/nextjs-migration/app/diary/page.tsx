
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import DiaryEntries from '@/components/diary/DiaryEntries';
import DiarySearch from '@/components/diary/DiarySearch';
import MoodFilter from '@/components/diary/MoodFilter';
import { getEnrichedDiaryEntries, getDiaryMoods } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Дневник | Личные записи',
  description: 'Мой личный дневник. Мысли, впечатления и заметки о разных моментах жизни.',
};

export default async function DiaryPage() {
  // Fetch all entries and moods
  const [entries, moods] = await Promise.all([
    getEnrichedDiaryEntries(),
    getDiaryMoods()
  ]);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Дневник</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <DiarySearch />
            <MoodFilter moods={moods} />
          </div>
          
          <div className="md:col-span-3">
            <DiaryEntries initialEntries={entries} />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
