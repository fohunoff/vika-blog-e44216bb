
import { useEffect, useState } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import RecipeSearch from '../components/recipes/RecipeSearch';
import RecipeFilters from '../components/recipes/RecipeFilters';
import RecipesList from '../components/recipes/RecipesList';
import RecipeTags from '../components/recipes/RecipeTags';
import { Category } from '@/services/api/mainApi';
import { toast } from '@/components/ui/use-toast';

const Recipes = () => {
  const { api } = useApi();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [recipesData, categoriesData, tagsData, navCategories] = await Promise.all([
          api.recipes.getRecipes(),
          api.recipes.getCategories(),
          api.recipes.getTags(),
          api.main.getIndexCategories()
        ]);
        
        // Get page info from navigation categories
        const recipesPageInfo = navCategories.find(cat => cat.link === '/recipes');
        setPageInfo(recipesPageInfo || null);
        
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
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error fetching recipe data:', error);
        
        // Show error toast to the user
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить рецепты. Пробуем снова...",
          variant: "destructive",
        });
        
        // If less than 3 retries, try again after a delay
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            fetchData();
          }, 1000); // Wait 1 second before retrying
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api.recipes, api.main, retryCount]);

  // Filter recipes by search query and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  // Handle tag click
  const handleTagClick = (tagName: string) => {
    setSearchQuery(tagName);
  };

  // Get popular tags (limit to 10)
  const popularTags = tags.slice(0, 10);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      {/* Заголовок и поиск */}
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          {pageInfo?.title || "РЕЦЕПТЫ"}
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          {pageInfo?.pageDescription || "Коллекция моих любимых рецептов — от простых повседневных блюд до особенных угощений для праздничного стола."}
        </p>
        
        <RecipeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      
      {/* Фильтры по категориям */}
      <RecipeFilters 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Список рецептов */}
      <div className="blog-container py-16">
        <RecipesList recipes={filteredRecipes} isLoading={isLoading} />
      </div>
      
      {/* Популярные теги */}
      <RecipeTags tags={popularTags} onTagClick={handleTagClick} />
      
      <Footer />
    </main>
  );
};

export default Recipes;
