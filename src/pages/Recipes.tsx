import React, { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import BlogFooter from '../components/BlogFooter';
import { useApi } from '../hooks/useApi';
import RecipeSearch from '../components/recipes/RecipeSearch';
import RecipeFilters from '../components/recipes/RecipeFilters';
import RecipesList from '../components/recipes/RecipesList';
import RecipeTags from '../components/recipes/RecipeTags';
import { Category } from '@/services/api/mainApi';

const Recipes = () => {
  const { api } = useApi();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [pageInfo, setPageInfo] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        
        const recipesPageInfo = navCategories.find(cat => cat.link === '/recipes');
        setPageInfo(recipesPageInfo || null);
        
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
  }, [api.recipes, api.main]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleTagClick = (tagName: string) => {
    setSearchQuery(tagName);
  };

  const popularTags = tags.slice(0, 10);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          {pageInfo?.title || "РЕЦЕПТЫ"}
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          {pageInfo?.pageDescription || "Коллекция моих любимых рецептов — от простых повседневных блюд до особенных угощений для праздничного стола."}
        </p>
        
        <RecipeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      
      <RecipeFilters 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
      />
      
      <div className="blog-container py-16">
        <RecipesList recipes={filteredRecipes} isLoading={isLoading} />
      </div>
      
      <RecipeTags tags={popularTags} onTagClick={handleTagClick} />
      
      <BlogFooter />
    </main>
  );
};

export default Recipes;
