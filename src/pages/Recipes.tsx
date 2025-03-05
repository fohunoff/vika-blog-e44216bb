
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Filter, Search, Tag, UtensilsCrossed } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Типы для рецептов
interface Recipe {
  id: string;
  title: string;
  description: string;
  category: Category;
  time: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  imageSrc: string;
  tags: Tag[];
}

interface Category {
  id: string;
  name: string;
  displayName: string;
}

interface Tag {
  id: string;
  name: string;
}

// Функции для работы с API
const fetchRecipes = async (categoryId?: string, search?: string): Promise<Recipe[]> => {
  try {
    let url = 'http://localhost:3000/api/recipes';
    const params = new URLSearchParams();
    
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Не удалось загрузить рецепты');
    return response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/recipes/categories');
    if (!response.ok) throw new Error('Не удалось загрузить категории');
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/recipes/tags');
    if (!response.ok) throw new Error('Не удалось загрузить теги');
    return response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

const Recipes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Получение данных с использованием React Query
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    onError: () => {
      toast({ 
        title: "Ошибка",
        description: "Не удалось загрузить категории рецептов",
        variant: "destructive" 
      });
    }
  });

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', activeCategory, searchQuery],
    queryFn: () => fetchRecipes(activeCategory, searchQuery),
    onError: () => {
      toast({ 
        title: "Ошибка",
        description: "Не удалось загрузить рецепты",
        variant: "destructive" 
      });
    }
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    onError: () => {
      toast({ 
        title: "Ошибка",
        description: "Не удалось загрузить теги",
        variant: "destructive" 
      });
    }
  });

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  // Обработчик формы поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Поиск происходит автоматически через useQuery
  };

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
        
        <form className="relative max-w-md mx-auto mb-16" onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Найти рецепт..."
            className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </form>
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
                {category.displayName}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Список рецептов */}
      <div className="blog-container py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blog-yellow"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          {recipe.category?.displayName}
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

export default Recipes;
