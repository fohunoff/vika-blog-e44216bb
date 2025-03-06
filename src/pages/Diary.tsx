
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
      // No need to specify queryKey as it's already set in the hook
      meta: {
        onError: (error) => {
          toast({
            title: "Ошибка загрузки записей",
            description: "Не удалось загрузить записи дневника. Пожалуйста, обновите страницу.",
            variant: "destructive",
          });
        }
      }
    }
  );
  
  const { api } = useApi();
  const [allMoods, setAllMoods] = useState<{id: string, name: string}[]>([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMood]);

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

  const filteredEntries = enrichedEntriesData?.items
    ? enrichedEntriesData.items.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMood = !selectedMood || entry.mood === selectedMood;
        return matchesSearch && matchesMood;
      })
    : [];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <DiaryEntries entries={filteredEntries} isLoading={isLoading} />
        
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
      
      <DiaryTags tags={allTags.slice(0, 12)} onTagClick={setSearchQuery} />
      
      <BlogFooter />
    </main>
  );
};

export default Diary;
