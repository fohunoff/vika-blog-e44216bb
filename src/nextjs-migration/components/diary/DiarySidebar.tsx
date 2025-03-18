
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Calendar, MessageSquare, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DiarySidebarProps {
  moods: any[];
  categories: any[];
  tags: any[];
}

const DiarySidebar = ({ moods, categories, tags }: DiarySidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  
  const handleMoodFilter = (moodId: string) => {
    router.push(`/diary?${createQueryString('mood', moodId)}`);
  };
  
  const handleCategoryFilter = (categoryId: string) => {
    router.push(`/diary?${createQueryString('category', categoryId)}`);
  };
  
  const handleTagFilter = (tagId: string) => {
    router.push(`/diary?${createQueryString('tag', tagId)}`);
  };
  
  const handleClearFilters = () => {
    router.push('/diary');
  };
  
  const currentMood = searchParams.get('mood');
  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');
  
  const hasActiveFilters = !!(currentMood || currentCategory || currentTag);

  return (
    <div className="space-y-8">
      {hasActiveFilters && (
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleClearFilters}
          >
            Сбросить все фильтры
          </Button>
        </div>
      )}
      
      {moods && moods.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} />
            <h3 className="text-lg font-semibold">Настроения</h3>
          </div>
          
          <div className="space-y-2">
            {moods.map((mood) => (
              <div 
                key={mood.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${mood.id === currentMood ? 'bg-blog-yellow text-blog-black' : 'hover:bg-gray-100'}`}
                onClick={() => handleMoodFilter(mood.id)}
              >
                <span>{mood.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {categories && categories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} />
            <h3 className="text-lg font-semibold">Категории</h3>
          </div>
          
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${category.id === currentCategory ? 'bg-blog-yellow text-blog-black' : 'hover:bg-gray-100'}`}
                onClick={() => handleCategoryFilter(category.id)}
              >
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} />
            <h3 className="text-lg font-semibold">Теги</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag.id}
                variant={tag.id === currentTag ? "default" : "outline"}
                className={`cursor-pointer ${tag.id === currentTag ? 'bg-blog-yellow text-blog-black hover:bg-blog-yellow/90' : 'hover:bg-gray-100'}`}
                onClick={() => handleTagFilter(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiarySidebar;
