
import { Metadata } from 'next';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import CozyHighlightsSection from '@/components/cozy/CozyHighlightsSection';
import CozyArticlesTabsSection from '@/components/cozy/CozyArticlesTabsSection';
import CozyPopularTagsSection from '@/components/cozy/CozyPopularTagsSection';
import CozySearchCategoriesSection from '@/components/cozy/CozySearchCategoriesSection';

export const metadata: Metadata = {
  title: 'Уют | Мой блог',
  description: 'Создание уюта и комфорта в доме. Идеи для интерьера и декора.',
};

export default function CozyPage() {
  // Mock data для исправления ошибок TypeScript
  const mockCategories = [];
  const mockArticles = [];
  const mockTags = [];
  
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Уют и комфорт</h1>
        
        <CozyHighlightsSection />
        
        <CozySearchCategoriesSection categories={mockCategories} />
        
        <CozyArticlesTabsSection articles={mockArticles} />
        
        <CozyPopularTagsSection tags={mockTags} />
      </section>
      
      <Footer />
    </main>
  );
}
