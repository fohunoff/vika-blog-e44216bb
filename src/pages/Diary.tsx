import { useEffect, useState } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useEnrichedDiaryEntries, useApi } from '../hooks/useApi';
import DiarySearch from '../components/diary/DiarySearch';
import MoodFilter from '../components/diary/MoodFilter';
import DiaryEntries from '../components/diary/DiaryEntries';
import DiaryTags from '../components/diary/DiaryTags';
import { Category } from '@/services/api/mainApi';
import { toast } from '@/components/ui/use-toast';

const Diary = () => {
  const { data: enrichedEntries, isLoading, error } = useEnrichedDiaryEntries();
  const { api } = useApi();
  const [allMoods, setAllMoods] = useState<{id: string, name: string}[]>([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPageData = async () => {
      try {
        const [moods, navCategories] = await Promise.all([
          api.diary.getMoods(),
          api.main.getIndexCategories()
        ]);

        setAllMoods(moods);

        const diaryPageInfo = navCategories.find(cat => cat.link === '/diary');
        setPageInfo(diaryPageInfo || null);

        setRetryCount(0);
      } catch (error) {
        console.error("Error fetching page data:", error);

        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные дневника. Пробуем снова...",
          variant: "destructive",
        });

        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            fetchPageData();
          }, 1000);
        }
      }
    };

    fetchPageData();
  }, [api.diary, api.main, retryCount]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка загрузки записей",
        description: "Не удалось загрузить записи дневника. Пожалуйста, обновите страницу.",
        variant: "destructive",
      });
    }
  }, [error]);

  const filteredEntries = enrichedEntries
    ? enrichedEntries
        .filter(entry => {
          const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              entry.content.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesMood = !selectedMood || entry.mood === selectedMood;
          return matchesSearch && matchesMood;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  const allTags = enrichedEntries
    ? Array.from(new Set(enrichedEntries.flatMap(entry => entry.tags || []))).filter(Boolean) as string[]
    : [];

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          {pageInfo?.title || "ЛИЧНЫЙ ДНЕВНИК"}
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          {pageInfo?.pageDescription || "Здесь я делюсь своими мыслями, впечатлениями и моментами из повседневной жизни. Маленькие радости, открытия и размышления."}
        </p>

        <DiarySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <MoodFilter
        allMoods={allMoods}
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelect}
      />

      <div className="blog-container py-16">
        <DiaryEntries entries={filteredEntries} moods={allMoods} isLoading={isLoading} />
      </div>

      <DiaryTags tags={allTags.slice(0, 12)} onTagClick={setSearchQuery} />

      <Footer />
    </main>
  );
};

export default Diary;
