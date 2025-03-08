import { useEffect, useState, useRef } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '@/types/models';
import { Category } from '@/services/api/mainApi';
import CafeSearch from '../components/cafes/CafeSearch';
import CafeFilters from '../components/cafes/CafeFilters';
import CafesList from '../components/cafes/CafesList';
import CafePopularTags from '../components/cafes/CafePopularTags.tsx';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Cafes = () => {
  const { api } = useApi();
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [cafes, setCafes] = useState<(Cafe & { categories?: string[], tags?: string[] })[]>([]);
  const [categories, setCategories] = useState<CafeCategory[]>([]);
  const [tags, setTags] = useState<CafeTag[]>([]);
  const [priceRanges, setPriceRanges] = useState<CafePriceRange[]>([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Set isMounted ref to true
    isMounted.current = true;

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const fetchData = async () => {
      if (!isMounted.current) return;

      setIsLoading(true);

      try {
        // Fetch data with timeout
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            console.warn('Request timed out, falling back to local data');
          }
        }, 5000); // 5 second timeout

        // Attempt to fetch enriched cafes first (most important data)
        try {
          const enrichedCafes = await api.cafes.getEnrichedCafes();
          if (isMounted.current) {
            setCafes(enrichedCafes);
          }
        } catch (error) {
          console.error('Error fetching enriched cafes:', error);
          if (isMounted.current) {
            toast({
              title: "Ошибка загрузки данных о кафе",
              description: "Используются резервные данные.",
              variant: "destructive",
            });
          }
        }

        // Fetch categories in parallel
        try {
          const categoriesData = await api.cafes.getCategories();
          if (isMounted.current) {
            setCategories(categoriesData);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }

        // Fetch tags in parallel
        try {
          const tagsData = await api.cafes.getTags();
          if (isMounted.current) {
            setTags(tagsData);
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
        }

        // Fetch price ranges in parallel
        try {
          const priceRangesData = await api.cafes.getPriceRanges();
          if (isMounted.current) {
            setPriceRanges(priceRangesData);
          }
        } catch (error) {
          console.error('Error fetching price ranges:', error);
        }

        // Fetch navigation categories in parallel
        try {
          const navCategories = await api.main.getIndexCategories();
          if (isMounted.current) {
            const cafesPageInfo = navCategories.find(cat => cat.link === '/cafes');
            setPageInfo(cafesPageInfo || null);
          }
        } catch (error) {
          console.error('Error fetching navigation categories:', error);
        }

        clearTimeout(timeoutId);
      } catch (error) {
        if (isMounted.current) {
          console.error('Error in fetchData:', error);

          // Show more user-friendly message
          toast({
            title: "Проблема при загрузке данных",
            description: "Отображаются доступные данные. Обновите страницу для полной загрузки.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Clean up function
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [api.cafes, api.main]);

  // Prepare data for rendering - fallback to default values if API data is missing
  const allCategories = categories.length > 0
      ? categories.map(cat => cat.name)
      : ["кофейня", "выпечка", "вегетарианское", "завтраки", "ужины"];

  const priceRangesList = priceRanges.length > 0
      ? priceRanges.map(range => range.name)
      : ["$", "$$", "$$$"];

  const popularTags = tags.length > 0
      ? tags.slice(0, 10).map(tag => tag.name)
      : ["Wi-Fi", "Уютная атмосфера", "Вкусный кофе", "Домашняя выпечка", "Веранда"];

  // Filter cafes by search query, category, and price range
  const filteredCafes = cafes.filter(cafe => {
    const matchesSearch =
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cafe.description && cafe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cafe.location && cafe.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
        (cafe.categories && Array.isArray(cafe.categories) &&
            cafe.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase()));

    const matchesPriceRange = !selectedPriceRange || cafe.priceRange === selectedPriceRange;

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  // Loading state with spinner
  if (isLoading) {
    return (
        <main className="min-h-screen pt-24 flex flex-col">
          <BlogHeader />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-blog-yellow mb-4" />
              <p className="text-lg">Загрузка кафе...</p>
            </div>
          </div>
          <Footer />
        </main>
    );
  }

  return (
      <main className="min-h-screen pt-24">
        <BlogHeader />

        {/* Заголовок и поиск */}
        <CafeSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            pageTitle={pageInfo?.title || "ОБЗОРЫ КАФЕ"}
            pageDescription={pageInfo?.pageDescription || "Здесь вы найдете мои впечатления о различных кафе и ресторанах, атмосфере и кухне. Делюсь любимыми местами и новыми открытиями."}
        />

        {/* Фильтры */}
        <CafeFilters
            categories={allCategories}
            priceRanges={priceRangesList}
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            setSelectedCategory={setSelectedCategory}
            setSelectedPriceRange={setSelectedPriceRange}
        />

        {/* Список кафе */}
        <div className="blog-container py-16">
          <CafesList
              cafes={filteredCafes}
              isLoading={isLoading}
          />
        </div>

        {/* Популярные категории */}
        <CafePopularTags
            tags={popularTags}
            onTagClick={setSearchQuery}
        />

        <Footer />
      </main>
  );
};

export default Cafes;
