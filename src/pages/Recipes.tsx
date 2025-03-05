
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { Recipe, Category, Tag } from '../types';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, Clock, ChefHat } from 'lucide-react';

// API-запросы
const API_URL = 'http://localhost:3000/api';

const fetchRecipes = async (categoryId: string | null, search: string | null, tagId: string | null): Promise<Recipe[]> => {
  let url = `${API_URL}/recipes`;
  const params = new URLSearchParams();
  
  if (categoryId) {
    params.append('categoryId', categoryId);
  }
  
  if (search) {
    params.append('search', search);
  }
  
  if (tagId) {
    params.append('tagId', tagId);
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Не удалось загрузить рецепты');
  }
  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/recipes/categories`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить категории');
  }
  return response.json();
};

const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_URL}/recipes/tags`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить теги');
  }
  return response.json();
};

const RecipesPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Получение данных с использованием React Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', activeCategory, searchQuery, activeTag],
    queryFn: () => fetchRecipes(activeCategory, searchQuery, activeTag),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  // Обработчик изменения тега
  const handleTagChange = (tagId: string | null) => {
    setActiveTag(tagId);
  };

  // Обработчик изменения поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Функция для определения класса для сложности рецепта
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Легко':
        return 'text-green-500';
      case 'Средне':
        return 'text-yellow-500';
      case 'Сложно':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blog-gray">
      <BlogHeader />
      
      <main className="flex-grow pt-24">
        <div className="blog-container py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-blog-yellow transition-colors">Главная</a>
            <ChevronRight size={16} />
            <span className="font-medium text-blog-black">Рецепты</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h1 className="text-3xl font-display font-bold mb-8 text-center">Кулинарные рецепты</h1>
          
            {/* Поиск */}
            <div className="relative max-w-lg mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск рецептов..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blog-yellow focus:border-transparent transition"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Категории */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Категории</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === null ? 'bg-blog-yellow text-blog-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(null)}
                >
                  Все рецепты
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      activeCategory === category.id ? 'bg-blog-yellow text-blog-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.displayName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Список рецептов */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <ChefHat className="h-10 w-10 mx-auto mb-4 text-blog-yellow animate-bounce" />
                <p className="text-lg font-medium">Готовим рецепты...</p>
              </div>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <article key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="relative">
                    <img 
                      src={recipe.imageSrc} 
                      alt={recipe.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white bg-blog-yellow bg-opacity-90 text-xs font-semibold px-2.5 py-1 rounded">
                          {categories.find(c => c.id === recipe.categoryId)?.displayName || 'Рецепт'}
                        </span>
                        <span className={`text-white text-xs font-semibold px-2.5 py-1 rounded ${
                          recipe.difficulty === 'Легко' ? 'bg-green-500' :
                          recipe.difficulty === 'Средне' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 hover:text-blog-yellow transition-colors">
                      {recipe.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{recipe.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span className="text-sm">{recipe.time}</span>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-sm text-blog-yellow hover:text-blog-yellow/80 hover:bg-blog-yellow/10 p-0">
                        Подробнее <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Рецепты не найдены</h3>
              <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(null);
                  setActiveTag(null);
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}

          {/* Популярные теги */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-display font-bold mb-4">Популярные теги</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeTag === tag.id ? 'bg-blog-yellow text-blog-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTagChange(activeTag === tag.id ? null : tag.id)}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
