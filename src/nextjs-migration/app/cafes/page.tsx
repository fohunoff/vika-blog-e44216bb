
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import CafeSearch from '@/components/cafes/CafeSearch';
import CafesList from '@/components/cafes/CafesList';
import CafePopularTags from '@/components/cafes/CafePopularTags';
import CafeFilters from '@/components/cafes/CafeFilters';

export const metadata: Metadata = {
  title: 'Кафе | Мой блог',
  description: 'Обзоры кафе и ресторанов. Уютные места для отдыха и вкусной еды.',
};

export default function CafesPage() {
  // Mock data for TypeScript compliance
  const searchQuery = "";
  const setSearchQuery = () => {};
  const cafes = [];
  const tags = [];
  const categories = [];
  const priceRanges = [];
  
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
            <CafeFilters 
              categories={categories}
              priceRanges={priceRanges}
              selectedCategory=""
              selectedPriceRange=""
            />
          </div>
          
          <div className="md:col-span-3">
            <CafesList 
              cafes={cafes} 
              isLoading={false} 
            />
            <CafePopularTags 
              tags={tags}
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
