
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import DiaryEntries from '@/components/diary/DiaryEntries';
import DiarySearch from '@/components/diary/DiarySearch';
import MoodFilter from '@/components/diary/MoodFilter';
import { fetchAPI } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Дневник | Личные записи',
  description: 'Мой личный дневник. Мысли, впечатления и заметки о разных моментах жизни.',
};

// API functions - moving them here instead of importing from lib/api
async function getEnrichedDiaryEntries() {
  return fetchAPI(`/diary/entries/enriched`);
}

async function getDiaryMoods() {
  return fetchAPI(`/diary/moods`);
}

export default async function DiaryPage() {
  // Fetch all entries and moods
  const [entries, moods] = await Promise.all([
    getEnrichedDiaryEntries(),
    getDiaryMoods()
  ]);

  // Создаем пустое состояние для поиска, в Next.js его можно будет
  // реализовать через Search Params или клиентские компоненты
  const searchQuery = "";
  const setSearchQuery = () => {};
  
  // В серверном компоненте нужно использовать "use client" для событий
  const handleMoodSelect = () => {};

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Дневник</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <DiarySearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            <MoodFilter 
              moods={moods} 
              selectedMood={null} 
              onMoodSelect={handleMoodSelect} 
            />
          </div>
          
          <div className="md:col-span-3">
            <DiaryEntries 
              entries={entries}
              moods={moods}
              isLoading={false} 
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
