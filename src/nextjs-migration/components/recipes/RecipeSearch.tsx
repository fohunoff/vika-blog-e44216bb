
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RecipeSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      
      router.push(`/recipes${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  return (
    <div className="max-w-md mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Поиск рецептов..."
          className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isPending}
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none"
          disabled={isPending}
        >
          <Search className="text-gray-400" size={20} />
        </button>
      </form>
    </div>
  );
};

export default RecipeSearch;
