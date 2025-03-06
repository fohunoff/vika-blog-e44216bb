
import { useEffect, useState } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { Cafe, CafeCategory, CafeTag } from '@/types/models';
import CafeSearch from '../components/cafes/CafeSearch';
import CafeFilters from '../components/cafes/CafeFilters';
import CafesList from '../components/cafes/CafesList';
import PopularTags from '../components/cafes/PopularTags';

const Cafes = () => {
  const { api } = useApi();
  const [cafes, setCafes] = useState<(Cafe & { categories?: string[], tags?: string[] })[]>([]);
  const [categories, setCategories] = useState<CafeCategory[]>([]);
  const [tags, setTags] = useState<CafeTag[]>([]);
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
        const enrichedCafes = await api.cafes.getEnrichedCafes();
        const categoriesData = await api.cafes.getCategories();
        const tagsData = await api.cafes.getTags();
        
        setCafes(enrichedCafes);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching cafe data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api.cafes]);

  // Get all unique categories from cafe data
  const allCategories = categories.map(cat => cat.name);

  // List of price ranges
  const priceRanges = ['$', '$$', '$$$'];

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
      />
      
      {/* Фильтры */}
      <CafeFilters 
        categories={allCategories}
        priceRanges={priceRanges}
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
      <PopularTags 
        tags={popularTags} 
        onTagClick={setSearchQuery} 
      />
      
      <Footer />
    </main>
  );
};

export default Cafes;
