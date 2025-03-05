
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { Recipe, Category, Tag } from '../types';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <BlogHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-blog-yellow transition-colors">Главная</a>
          <ChevronRight size={16} />
          <span className="font-medium text-gray-800">Рецепты</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Рецепты</h1>
          
          {/* Поиск */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Поиск рецептов..."
                className="w-full pl-10 border-gray-200 rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {/* Категории */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Категории</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className={activeCategory === null ? "bg-blog-yellow text-black hover:bg-blog-yellow/90" : ""}
                onClick={() => handleCategoryChange(null)}
              >
                Все рецепты
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-blog-yellow text-black hover:bg-blog-yellow/90" : ""}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.displayName}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Теги */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Популярные теги</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  size="sm"
                  variant={activeTag === tag.id ? "default" : "outline"}
                  className={`rounded-full ${activeTag === tag.id ? "bg-blog-yellow text-black hover:bg-blog-yellow/90" : ""}`}
                  onClick={() => handleTagChange(activeTag === tag.id ? null : tag.id)}
                >
                  #{tag.name}
                </Button>
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
              <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative h-52">
                  <img 
                    src={recipe.imageSrc} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 m-3">
                    <span className="inline-block bg-blog-yellow text-black text-xs font-semibold px-2.5 py-1 rounded">
                      {categories.find(c => c.id === recipe.categoryId)?.displayName || 'Рецепт'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blog-yellow transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{recipe.description}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">{recipe.time}</span>
                    </div>
                    
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      recipe.difficulty === 'Легко' ? 'text-green-800 bg-green-100' :
                      recipe.difficulty === 'Средне' ? 'text-yellow-800 bg-yellow-100' : 'text-red-800 bg-red-100'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Рецепты не найдены</h3>
            <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setActiveTag(null);
              }}
              className="bg-blog-yellow text-black hover:bg-blog-yellow/90"
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
