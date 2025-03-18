
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

interface CafeSidebarProps {
  categories: any[];
  priceRanges: any[];
}

const CafeSidebar = ({ categories, priceRanges }: CafeSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get('category');
  const currentPriceRange = searchParams.get('priceRange');
  
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
      router.push(`/cafes${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  const handlePriceRangeClick = (priceRangeId: string) => {
    startTransition(() => {
      const queryString = createQueryString('priceRange', 
        priceRangeId === currentPriceRange ? '' : priceRangeId
      );
      router.push(`/cafes${queryString ? `?${queryString}` : ''}`);
    });
  };
  
  const handleClearFilters = () => {
    startTransition(() => {
      router.push('/cafes');
    });
  };
  
  const hasFilters = !!(currentCategory || currentPriceRange);

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
      
      {priceRanges && priceRanges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6">Ценовая категория</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div 
                key={range.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  range.id === currentPriceRange ? 'bg-blog-yellow text-blog-black' : 'hover:bg-gray-100'
                }`}
                onClick={() => handlePriceRangeClick(range.id)}
              >
                <span>{range.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeSidebar;
