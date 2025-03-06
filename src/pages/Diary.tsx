import React, { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import BlogFooter from '../components/BlogFooter';
import { useEnrichedDiaryEntries, useApi } from '../hooks/useApi';
import DiarySearch from '../components/diary/DiarySearch';
import MoodFilter from '../components/diary/MoodFilter';
import DiaryEntries from '../components/diary/DiaryEntries';
import DiaryTags from '../components/diary/DiaryTags';
import { Category } from '@/services/api/mainApi';

const Diary = () => {
  const { data: enrichedEntries, isLoading } = useEnrichedDiaryEntries();
  const { api } = useApi();
  const [allMoods, setAllMoods] = useState<{id: string, name: string}[]>([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch moods and page info
    Promise.all([
      api.diary.getMoods(),
      api.main.getIndexCategories()
    ]).then(([moods, navCategories]) => {
      setAllMoods(moods);
      
      // Get page info from navigation categories
      const diaryPageInfo = navCategories.find(cat => cat.link === '/diary');
      setPageInfo(diaryPageInfo || null);
    });
  }, [api.diary, api.main]);

  // Filter entries based on search query and selected mood
  const filteredEntries = enrichedEntries
    ? enrichedEntries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMood = !selectedMood || entry.mood === selectedMood;
        return matchesSearch && matchesMood;
      })
    : [];

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  // Collect all tags from diary entries
  const allTags = enrichedEntries
    ? Array.from(new Set(enrichedEntries.flatMap(entry => entry.tags || []))).filter(Boolean) as string[]
    : [];

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      {/* Заголовок и поиск */}
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          {pageInfo?.title || "ЛИЧНЫЙ ДНЕВНИК"}
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          {pageInfo?.pageDescription || "Здесь я делюсь своими мыслями, впечатлениями и моментами из повседневной жизни. Маленькие радости, открытия и размышления."}
        </p>
        
        <DiarySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      
      {/* Фильтр по настроению */}
      <MoodFilter 
        allMoods={allMoods} 
        selectedMood={selectedMood} 
        onMoodSelect={handleMoodSelect} 
      />
      
      {/* Записи дневника */}
      <div className="blog-container py-16">
        <DiaryEntries entries={filteredEntries} isLoading={isLoading} />
      </div>
      
      {/* Популярные теги */}
      <DiaryTags tags={allTags.slice(0, 12)} onTagClick={setSearchQuery} />
      
      <BlogFooter />
    </main>
  );
};

export default Diary;
