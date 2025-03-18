
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CozyCategory {
  id: string;
  name: string;
}

interface CozySearchSectionProps {
  categories: CozyCategory[];
}

const CozySearchSection = ({ categories }: CozySearchSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      if (!searchQuery.trim()) {
        router.push('/cozy');
        return;
      }
      
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      router.push(`/cozy?${params.toString()}`);
    });
  };

  // Если категории не предоставлены, показываем заглушки
  const displayCategories = categories.length > 0 ? categories : [
    { id: 'living-room', name: 'Гостиная' },
    { id: 'bedroom', name: 'Спальня' },
    { id: 'kitchen', name: 'Кухня' },
    { id: 'bathroom', name: 'Ванная' },
    { id: 'children', name: 'Детская' },
    { id: 'decor', name: 'Декор' },
    { id: 'plants', name: 'Растения' },
    { id: 'lighting', name: 'Освещение' }
  ];

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
        <form onSubmit={handleSubmit} className="w-full md:w-2/3 relative">
          <Input
            type="text"
            placeholder="Поиск статей, идей и советов..."
            className="w-full px-4 py-6 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blog-yellow/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isPending}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-400"
            variant="ghost"
            disabled={isPending}
          >
            <Search size={20} />
          </Button>
        </form>

        <Button 
          type="submit" 
          className="w-full md:w-1/3 bg-blog-yellow hover:bg-blog-yellow/90 text-white py-6"
          onClick={handleSubmit}
          disabled={isPending}
        >
          Искать
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/cozy/category/${category.id}`}
            className="bg-white hover:bg-blog-yellow hover:text-white rounded-lg py-3 text-center transition-colors shadow-sm"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CozySearchSection;
