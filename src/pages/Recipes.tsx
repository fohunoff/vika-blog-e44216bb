
import { useState, useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import BlogFooter from '../components/Footer';
import RecipesList from '../components/recipes/RecipesList';
import RecipeSearch from '../components/recipes/RecipeSearch';
import RecipeFilters from '../components/recipes/RecipeFilters';
import RecipeTags from '../components/recipes/RecipeTags';
import { usePaginatedEnrichedRecipes, useApi } from '../hooks/useApi';
import { toast } from '@/components/ui/use-toast';
import PaginationNav from '@/components/ui/pagination-nav';

const RecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Сбрасываем пагинацию при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Загружаем рецепты с пагинацией
  const { data, isLoading, error } = usePaginatedEnrichedRecipes(
    { page: currentPage, limit: itemsPerPage },
    {
      onError: (error) => {
        toast({
          title: "Ошибка загрузки рецептов",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  );

  // Получаем все необходимые данные из API
  const { api } = useApi();
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем категории и уровни сложности
        const [categoriesData, difficultyLevelsData, allRecipes] = await Promise.all([
          api.recipes.getCategories(),
          api.recipes.getDifficultyLevels(),
          api.recipes.getEnrichedRecipes()
        ]);
        
        setCategories(categoriesData);
        setDifficultyLevels(difficultyLevelsData);
        
        // Собираем все уникальные теги из рецептов
        if (allRecipes) {
          const tags = Array.from(
            new Set(
              allRecipes.flatMap((recipe: any) => recipe.tags || [])
            )
          ).filter(Boolean) as string[];
          
          setAllTags(tags);
        }
      } catch (error: any) {
        toast({
          title: "Ошибка загрузки данных",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchData();
  }, [api]);

  // Фильтрация рецептов
  const filteredRecipes = data?.items.filter((recipe: any) => {
    const matchesSearch = 
      !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || recipe.categoryId === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) || [];

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Скролл в начало страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <div className="blog-container py-8">
        <h1 className="section-title mb-8 text-center">РЕЦЕПТЫ</h1>
        
        {/* Поиск */}
        <RecipeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          {/* Сайдбар с фильтрами */}
          <div className="col-span-1">
            <RecipeFilters 
              categories={categories}
              difficultyLevels={difficultyLevels}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              setSelectedCategory={setSelectedCategory}
              setSelectedDifficulty={setSelectedDifficulty}
            />
          </div>
          
          {/* Список рецептов */}
          <div className="col-span-1 lg:col-span-3">
            <RecipesList recipes={filteredRecipes} isLoading={isLoading} />
            
            {/* Пагинация */}
            {!isLoading && data && data.pagination.totalPages > 1 && (
              <div className="mt-12">
                <PaginationNav 
                  currentPage={currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Популярные теги */}
      <RecipeTags tags={allTags.slice(0, 15)} onTagClick={(tag) => setSearchQuery(tag)} />
      
      <BlogFooter />
    </main>
  );
};

export default RecipesPage;
