
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import CafeSearch from '@/components/cafes/CafeSearch';
import CafeFilters from '@/components/cafes/CafeFilters';
import CafesList from '@/components/cafes/CafesList';
import CafePopularTags from '@/components/cafes/CafePopularTags';

export const metadata: Metadata = {
  title: 'Кафе | Мой блог',
  description: 'Обзоры и рекомендации кафе и ресторанов.',
};

export default function CafesPage() {
  // Mock props для исправления ошибок TypeScript
  const searchQuery = "";
  const categories = [];
  const priceRanges = [];
  const cafes = [];
  const tags = [];
  
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Кафе и рестораны</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <CafeSearch 
              searchQuery={searchQuery} 
              setSearchQuery={() => {}} 
            />
            <CafeFilters 
              categories={categories} 
              priceRanges={priceRanges}
              selectedCategory="" 
              selectedPriceRange="" 
              onCategoryChange={() => {}} 
              onPriceRangeChange={() => {}} 
            />
          </div>
          
          <div className="md:col-span-3">
            <CafesList 
              cafes={cafes} 
              isLoading={false} 
            />
            <CafePopularTags 
              tags={tags} 
              onTagClick={() => {}} 
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
