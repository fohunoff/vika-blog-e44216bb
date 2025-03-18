
import { Metadata } from 'next';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import CafesList from '@/nextjs-migration/components/cafes/CafesList';
import CafeSearch from '@/nextjs-migration/components/cafes/CafeSearch';
import CafeSidebar from '@/nextjs-migration/components/cafes/CafeSidebar';
import { Cafe, CafeCategory, CafeTag, CafePriceRange } from '@/types/cafe';

export const metadata: Metadata = {
  title: 'Кафе | Мой блог',
  description: 'Обзоры кафе и ресторанов. Уютные места для отдыха и вкусной еды.',
};

// Функции для получения данных
async function getCafes(): Promise<(Cafe & { categories?: string[], tags?: string[] })[]> {
  return fetchAPI('/cafes');
}

async function getCafeCategories(): Promise<CafeCategory[]> {
  return fetchAPI('/cafes/categories');
}

async function getCafeTags(): Promise<CafeTag[]> {
  return fetchAPI('/cafes/tags');
}

async function getCafePriceRanges(): Promise<CafePriceRange[]> {
  return fetchAPI('/cafes/price-ranges');
}

export default async function CafesPage() {
  // Получаем данные с сервера
  const [cafes, categories, tags, priceRanges] = await Promise.all([
    getCafes().catch(() => [] as (Cafe & { categories?: string[], tags?: string[] })[]),
    getCafeCategories().catch(() => [] as CafeCategory[]),
    getCafeTags().catch(() => [] as CafeTag[]),
    getCafePriceRanges().catch(() => [] as CafePriceRange[])
  ]);
  
  return (
    <MainLayout>
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Кафе</h1>
        
        <CafeSearch />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <CafeSidebar 
              categories={categories} 
              priceRanges={priceRanges} 
            />
          </div>
          
          <div className="md:col-span-3">
            <CafesList cafes={cafes} />
            
            {tags && tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Популярные теги</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: CafeTag) => (
                    <span 
                      key={tag.id}
                      className="bg-blog-yellow-light text-blog-black px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blog-yellow"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
