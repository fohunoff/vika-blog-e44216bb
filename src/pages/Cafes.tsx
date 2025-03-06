
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Search, MapPin, Clock, Tag, Star, Filter, MessageSquare } from 'lucide-react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from '../hooks/useApi';
import { Cafe, CafeCategory, CafeTag } from '@/types/models';

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

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-blog-yellow text-blog-yellow" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="text-gray-300" size={18} />
          <Star className="absolute top-0 left-0 fill-blog-yellow text-blog-yellow overflow-hidden w-[9px]" size={18} />
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }

    return <div className="flex">{stars}</div>;
  };

  // Get popular tags from our cafes
  const popularTags = tags.slice(0, 10).map(tag => tag.name);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      {/* Заголовок и поиск */}
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          ОБЗОРЫ КАФЕ
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          Здесь вы найдете мои впечатления о различных кафе и ресторанах, атмосфере и кухне. Делюсь любимыми местами и новыми открытиями.
        </p>
        
        <div className="relative max-w-md mx-auto mb-16">
          <Input
            type="text"
            placeholder="Найти кафе или ресторан..."
            className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      
      {/* Фильтры */}
      <div className="bg-blog-black py-8">
        <div className="blog-container">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            {/* Категории */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-blog-white">
                <Tag size={20} />
                <h2 className="text-xl font-bold">Категория:</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedCategory === category 
                        ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                        : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Ценовая категория */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-blog-white">
                <Filter size={20} />
                <h2 className="text-xl font-bold">Цена:</h2>
              </div>
              
              <div className="flex gap-2">
                {priceRanges.map((price) => (
                  <Button
                    key={price}
                    variant={selectedPriceRange === price ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedPriceRange === price 
                        ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                        : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                    }`}
                    onClick={() => setSelectedPriceRange(selectedPriceRange === price ? null : price)}
                  >
                    {price}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Список кафе */}
      <div className="blog-container py-16">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Загрузка кафе...</p>
          </div>
        ) : filteredCafes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCafes.map((cafe, index) => (
              <article 
                key={cafe.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={cafe.imageSrc}
                    alt={cafe.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-blog-yellow text-blog-black px-3 py-1 rounded-full font-medium">
                    {cafe.priceRange}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">{cafe.name}</h2>
                    <div className="flex items-center gap-1">
                      {renderStars(cafe.rating)}
                      <span className="ml-1 text-gray-600 font-medium">{cafe.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{cafe.location}</span>
                    </div>
                    {cafe.openHours && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{cafe.openHours}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-6 line-clamp-3">{cafe.shortDescription || cafe.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {cafe.categories && cafe.categories.map(category => (
                      <Badge 
                        key={category}
                        variant="secondary"
                        className="bg-blog-yellow-light text-blog-black"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link to={`/cafes/${cafe.id}`}>
                    <Button 
                      variant="outline"
                      className="border-blog-yellow text-blog-black hover:bg-blog-yellow hover:text-blog-black"
                    >
                      <Coffee size={18} className="mr-2" />
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Coffee size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">Кафе не найдены</h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или выбрать другую категорию.
            </p>
          </div>
        )}
      </div>
      
      {/* Популярные категории */}
      <div className="bg-blog-yellow-light py-12">
        <div className="blog-container">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} />
            <h2 className="text-xl font-bold">Популярные запросы</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-blog-black cursor-pointer"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Cafes;
