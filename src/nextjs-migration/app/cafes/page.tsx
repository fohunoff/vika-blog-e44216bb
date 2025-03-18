
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import CafeSearch from '@/components/cafes/CafeSearch';
import CafesList from '@/components/cafes/CafesList';
import CafePopularTags from '@/components/cafes/CafePopularTags';
import CafeFilters from '@/components/cafes/CafeFilters';
import { fetchAPI } from '@/nextjs-migration/lib/utils';

export const metadata: Metadata = {
  title: 'Кафе | Мой блог',
  description: 'Обзоры кафе и ресторанов. Уютные места для отдыха и вкусной еды.',
};

// Функции для получения данных
async function getCafes() {
  return fetchAPI('/cafes');
}

async function getCafeCategories() {
  return fetchAPI('/cafes/categories');
}

async function getCafeTags() {
  return fetchAPI('/cafes/tags');
}

async function getCafePriceRanges() {
  return fetchAPI('/cafes/price-ranges');
}

export default async function CafesPage() {
  // Получаем данные с сервера
  const [cafes, categories, tags, priceRanges] = await Promise.all([
    getCafes(),
    getCafeCategories(),
    getCafeTags(),
    getCafePriceRanges()
  ]).catch(error => {
    console.error('Error fetching cafe data:', error);
    return [[], [], [], []];
  });
  
  // Создаем пустое состояние для поиска, в Next.js его можно будет
  // реализовать через Search Params или клиентские компоненты
  const searchQuery = "";
  const setSearchQuery = () => {};
  
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Кафе</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <CafeSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Категории</h3>
              <div className="space-y-2">
                {categories && categories.map((category: any) => (
                  <div 
                    key={category.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold mb-4 mt-6">Ценовая категория</h3>
              <div className="space-y-2">
                {priceRanges && priceRanges.map((range: any) => (
                  <div 
                    key={range.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <span>{range.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <CafesList 
              cafes={cafes} 
              isLoading={false} 
            />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Популярные теги</h3>
              <div className="flex flex-wrap gap-2">
                {tags && tags.map((tag: any) => (
                  <span 
                    key={tag.id}
                    className="bg-blog-yellow-light text-blog-black px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blog-yellow"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
