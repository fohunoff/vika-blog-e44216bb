
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Filter, Search, Tag, UtensilsCrossed } from 'lucide-react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ICategory, ITag } from '@/types';

// Типы для рецептов
interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  time: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  imageSrc: string;
}

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

const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await fetch(`${API_URL}/recipes/categories`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить категории');
  }
  return response.json();
};

const fetchTags = async (): Promise<ITag[]> => {
  const response = await fetch(`${API_URL}/recipes/tags`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить теги');
  }
  return response.json();
};

const RecipessPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Получение данных с использованием React Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', activeCategory, searchQuery],
    queryFn: () => fetchRecipes(activeCategory, searchQuery),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Функция для обработки ошибок API
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




  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Категории рецептов
//   const categories = [
//     { id: 'breakfast', name: 'Завтраки' },
//     { id: 'soups', name: 'Супы' },
//     { id: 'main', name: 'Основные блюда' },
//     { id: 'desserts', name: 'Десерты' },
//     { id: 'drinks', name: 'Напитки' },
//   ];

  // Примеры рецептов
  const allRecipes: Recipe[] = [
    {
      id: 'pumpkin-soup',
      title: 'Тыквенный суп-пюре с имбирем',
      description: 'Нежный, согревающий суп с ароматом осенних специй и ноткой имбиря.',
      category: 'soups',
      time: '30 минут',
      difficulty: 'Легко',
      imageSrc: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=2574',
    },
    {
      id: 'avocado-toast',
      title: 'Тост с авокадо и яйцом пашот',
      description: 'Идеальный питательный завтрак для энергичного начала дня.',
      category: 'breakfast',
      time: '15 минут',
      difficulty: 'Легко',
      imageSrc: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 'ratatouille',
      title: 'Рататуй с прованскими травами',
      description: 'Яркое овощное блюдо с ароматными травами для любителей средиземноморской кухни.',
      category: 'main',
      time: '60 минут',
      difficulty: 'Средне',
      imageSrc: 'https://images.unsplash.com/photo-1572453800999-e8d2d0d95b2b?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 'berry-pavlova',
      title: 'Павлова с летними ягодами',
      description: 'Воздушный десерт с хрустящей корочкой, нежным кремом и свежими ягодами.',
      category: 'desserts',
      time: '90 минут',
      difficulty: 'Сложно',
      imageSrc: 'https://images.unsplash.com/photo-1488477181946-6428a0a36077?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 'matcha-latte',
      title: 'Латте с чаем матча',
      description: 'Бодрящий и полезный напиток с антиоксидантами и нежной молочной пенкой.',
      category: 'drinks',
      time: '10 минут',
      difficulty: 'Легко',
      imageSrc: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 'borsch',
      title: 'Классический борщ с говядиной',
      description: 'Наваристый, ароматный суп со свеклой, овощами и нежной говядиной.',
      category: 'soups',
      time: '120 минут',
      difficulty: 'Средне',
      imageSrc: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=2000',
    },
  ];

  // Фильтрация рецептов по поиску и категории
  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

//   // Обработчик изменения категории
//   const handleCategoryChange = (categoryId: string) => {
//     setActiveCategory(activeCategory === categoryId ? null : categoryId);
//   };

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
            onChange={handleSearchChange}
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
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className={`rounded-full ${
                  activeCategory === null 
                    ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                    : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                Все
              </Button>
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
                  {category.displayName}
                </Button>
              ))}
          </div>
        </div>
      </div>

      {/* Список рецептов */}
      <div className="blog-container py-16">
        {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Загрузка рецептов...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
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
                          {categories.find(cat => cat.id === recipe.category)?.name}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 mb-4">{recipe.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChefHat size={16} />
                          <span>{recipe.difficulty}</span>
                        </div>
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
            {tags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-blog-black cursor-pointer"
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

export default RecipessPage;