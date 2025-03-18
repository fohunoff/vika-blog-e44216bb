
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DiarySearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      startTransition(() => {
        router.push('/diary');
      });
      return;
    }
    
    startTransition(() => {
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      router.push(`/diary?${params.toString()}`);
    });
  };

  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold mb-8">Дневник</h1>
      
      <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Поиск по записям..."
          className="pl-10 pr-4 py-6 rounded-full border-2 border-blog-yellow bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FileText
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
          variant="ghost"
          disabled={isPending}
        >
          <Search size={20} />
        </Button>
      </form>
    </div>
  );
};

export default DiarySearchHeader;
