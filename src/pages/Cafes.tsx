import { useEffect, useState } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '@/types/models';
import { Category } from '@/services/api/mainApi';
import CafeSearch from '../components/cafes/CafeSearch';
import CafeFilters from '../components/cafes/CafeFilters';
import CafesList from '../components/cafes/CafesList';
import CafePopularTags from '../components/cafes/CafePopularTags.tsx';

const Cafes = () => {
  const { api } = useApi();

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
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use the enriched cafes endpoint that has categories and tags
        const [enrichedCafes, categoriesData, tagsData, priceRangesData, navCategories] = await Promise.all([
          api.cafes.getEnrichedCafes(),
          api.cafes.getCategories(),
          api.cafes.getTags(),
          api.cafes.getPriceRanges(),
          api.main.getIndexCategories()
        ]);

        // Get page info from navigation categories
        const cafesPageInfo = navCategories.find(cat => cat.link === '/cafes');
        setPageInfo(cafesPageInfo || null);

        setCafes(enrichedCafes);
        setCategories(categoriesData);
        setTags(tagsData);
        setPriceRanges(priceRangesData);

      } catch (error) {
        console.error('Error fetching cafe data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api.cafes, api.main]);

  // Get all unique categories from cafe data
  const allCategories = categories.map(cat => cat.name);

  // List of price ranges from our mock data
  const priceRangesList = priceRanges.map(range => range.name);

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

  // Get popular tags from our cafes
  const popularTags = tags.slice(0, 10).map(tag => tag.name);

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
