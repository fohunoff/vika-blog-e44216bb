
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

interface RecipeSidebarProps {
  categories: any[];
  difficultyLevels: any[];
}

const RecipeSidebar = ({ categories, difficultyLevels }: RecipeSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get('category');
  const currentDifficulty = searchParams.get('difficulty');
  
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    return params.toString();
  };
  
  const handleCategoryClick = (categoryId: string) => {
    startTransition(() => {
      const queryString = createQueryString('category', 
        categoryId === currentCategory ? '' : categoryId
      );
      router.push(`/recipes${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  const handleDifficultyClick = (difficultyId: string) => {
    startTransition(() => {
      const queryString = createQueryString('difficulty', 
        difficultyId === currentDifficulty ? '' : difficultyId
      );
      router.push(`/recipes${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  const handleClearFilters = () => {
    startTransition(() => {
      router.push('/recipes');
    });
  };
  
  const hasFilters = !!(currentCategory || currentDifficulty);

  return (
    <div className="space-y-8">
      {hasFilters && (
        <Button 
          variant="outline" 
          className="w-full mb-6"
          onClick={handleClearFilters}
          disabled={isPending}
        >
          Сбросить фильтры
        </Button>
      )}
      
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Категории</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  category.id === currentCategory ? 'bg-blog-yellow text-blog-black' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {difficultyLevels && difficultyLevels.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6">Сложность</h3>
          <div className="space-y-2">
            {difficultyLevels.map((level) => (
              <div 
                key={level.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  level.id === currentDifficulty ? 'bg-blog-yellow text-blog-black' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleDifficultyClick(level.id)}
              >
                <span>{level.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSidebar;
