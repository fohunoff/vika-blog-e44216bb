
import { useEffect, useState } from 'react';
import BlogHeader from '../components/BlogHeader';
import BlogFooter from '../components/Footer';
import { usePaginatedEnrichedDiaryEntries, useApi } from '../hooks/useApi';
import DiarySearch from '../components/diary/DiarySearch';
import MoodFilter from '../components/diary/MoodFilter';
import DiaryEntries from '../components/diary/DiaryEntries';
import DiaryTags from '../components/diary/DiaryTags';
import { Category } from '@/services/api/mainApi';
import { toast } from '@/components/ui/use-toast';
import PaginationNav from '@/components/ui/pagination-nav';

const Diary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  const { data: enrichedEntriesData, isLoading, error } = usePaginatedEnrichedDiaryEntries(
    { page: currentPage, limit: itemsPerPage },
    {
      onError: (error) => {
        toast({
          title: "Ошибка загрузки записей",
          description: "Не удалось загрузить записи дневника. Пожалуйста, обновите страницу.",
          variant: "destructive",
        });
      }
    }
  );
  
  const { api } = useApi();
  const [allMoods, setAllMoods] = useState<{id: string, name: string}[]>([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Сбрасываем пагинацию при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMood]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Function to fetch moods and page info
    const fetchPageData = async () => {
      try {
        const [moods, navCategories] = await Promise.all([
          api.diary.getMoods(),
          api.main.getIndexCategories()
        ]);
        
        setAllMoods(moods);
        
        // Get page info from navigation categories
        const diaryPageInfo = navCategories.find(cat => cat.link === '/diary');
        setPageInfo(diaryPageInfo || null);
        
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error("Error fetching page data:", error);
        
        // Show error toast to the user
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные дневника. Пробуем снова...",
          variant: "destructive",
        });
        
        // If less than 3 retries, try again after a delay
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            fetchPageData();
          }, 1000); // Wait 1 second before retrying
        }
      }
    };

    fetchPageData();
  }, [api.diary, api.main, retryCount]);

  useEffect(() => {
    // Show error toast if diary entries failed to load
    if (error) {
      toast({
        title: "Ошибка загрузки записей",
        description: "Не удалось загрузить записи дневника. Пожалуйста, обновите страницу.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Filter entries based on search query and selected mood
  const filteredEntries = enrichedEntriesData?.items
    ? enrichedEntriesData.items.filter(entry => {
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

  // Collect all tags from diary entries (для этого нам нужны все записи)
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        const allEntries = await api.diary.getEnrichedDiaryEntries();
        const tags = Array.from(new Set(allEntries.flatMap(entry => entry.tags || []))).filter(Boolean) as string[];
        setAllTags(tags);
      } catch (error) {
        console.error("Error fetching all entries for tags:", error);
      }
    };
    
    fetchAllEntries();
  }, [api.diary]);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Скролл в начало страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        
        {/* Пагинация */}
        {!isLoading && enrichedEntriesData && enrichedEntriesData.pagination.totalPages > 1 && (
          <div className="mt-12">
            <PaginationNav 
              currentPage={currentPage}
              totalPages={enrichedEntriesData.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      
      {/* Популярные теги */}
      <DiaryTags tags={allTags.slice(0, 12)} onTagClick={setSearchQuery} />
      
      <BlogFooter />
    </main>
  );
};

export default Diary;
