
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { Recipe, Category, Tag } from '../types';

// API-запросы
const API_URL = 'http://localhost:3000/api';

const fetchRecipes = async (categoryId: string | null, search: string | null): Promise<Recipe[]> => {
  let url = `${API_URL}/recipes`;
  const params = new URLSearchParams();
  
  if (categoryId) {
    params.append('categoryId', categoryId);
  }
  
  if (search) {
    params.append('search', search);
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
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Получение данных с использованием React Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    meta: undefined, // Удаляем проблемные onError
  });

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', activeCategory, searchQuery],
    queryFn: () => fetchRecipes(activeCategory, searchQuery),
    meta: undefined, // Удаляем проблемные onError
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    meta: undefined, // Удаляем проблемные onError
  });

  // Функция для обработки ошибок API (может быть перенесена в глобальный обработчик)
  const handleError = (message: string) => {
    toast({
      title: "Ошибка",
      description: message,
      variant: "destructive"
    });
  };

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  // Обработчик изменения поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Все рецепты</h1>

      {/* Поиск и фильтрация */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Поиск рецептов..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-2/3 flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 rounded-full ${
              activeCategory === null ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full ${
                activeCategory === category.id ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Список рецептов */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Загрузка рецептов...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={recipe.imageSrc} 
                alt={recipe.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{recipe.time}</span>
                  <span className={`text-sm ${
                    recipe.difficulty === 'Легко' ? 'text-green-500' :
                    recipe.difficulty === 'Средне' ? 'text-yellow-500' : 'text-red-500'
                  }`}>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">Рецепты не найдены</h3>
          <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Популярные теги */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Популярные теги</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
