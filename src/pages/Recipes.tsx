
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Filter, Search, Tag, UtensilsCrossed } from 'lucide-react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from '../hooks/useApi';

const Recipes = () => {
  const { api } = useApi();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [recipesData, categoriesData, tagsData] = await Promise.all([
          api.recipes.getRecipes(),
          api.recipes.getCategories(),
          api.recipes.getTags(),
        ]);
        
        // Enrich recipe data with category and tag information
        const enrichedRecipes = recipesData.map(recipe => {
          const category = categoriesData.find(c => recipe.categoryId === c.id);
          const recipeTags = recipe.tagIds 
            ? recipe.tagIds.map(id => tagsData.find(t => t.id === id)).filter(Boolean) 
            : [];
            
          return {
            ...recipe,
            category: category?.id || null,
            categoryName: category?.name || 'Без категории',
            tags: recipeTags.map(t => t.name)
          };
        });
        
        setRecipes(enrichedRecipes);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api.recipes]);

  // Filter recipes by search query and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  // Get popular tags (limit to 10)
  const popularTags = tags.slice(0, 10);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      {/* Заголовок и поиск */}
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          РЕЦЕПТЫ
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          Коллекция моих любимых рецептов — от простых повседневных блюд до особенных угощений для праздничного стола.
        </p>
        
        <div className="relative max-w-md mx-auto mb-16">
          <Input
            type="text"
            placeholder="Найти рецепт..."
            className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      
      {/* Фильтры по категориям */}
      <div className="bg-blog-black py-8">
        <div className="blog-container">
          <div className="flex items-center gap-2 mb-4 text-blog-white">
            <Filter size={20} />
            <h2 className="text-xl font-bold">Категории</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`rounded-full ${
                  activeCategory === category.id 
                    ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                    : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Список рецептов */}
      <div className="blog-container py-16">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Загрузка рецептов...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, index) => (
              <div key={recipe.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Link to={`/recipes/${recipe.id}`} className="block">
                  <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={recipe.imageSrc} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blog-yellow hover:bg-blog-yellow-dark text-blog-black">
                          {recipe.categoryName}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 mb-4">{recipe.description || recipe.shortDescription}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {recipe.time && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{recipe.time}</span>
                          </div>
                        )}
                        {recipe.difficulty && (
                          <div className="flex items-center gap-1">
                            <ChefHat size={16} />
                            <span>{recipe.difficulty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UtensilsCrossed size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">Рецепты не найдены</h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или выбрать другую категорию.
            </p>
          </div>
        )}
      </div>
      
      {/* Популярные теги */}
      <div className="bg-blog-yellow-light py-12">
        <div className="blog-container">
          <div className="flex items-center gap-2 mb-6">
            <Tag size={20} />
            <h2 className="text-xl font-bold">Популярные теги</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-blog-black cursor-pointer"
                onClick={() => setSearchQuery(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Recipes;
