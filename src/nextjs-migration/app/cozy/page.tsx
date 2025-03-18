
import { Metadata } from 'next';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import CozyHighlightsSection from '@/nextjs-migration/components/cozy/CozyHighlightsSection';
import CozySearchSection from '@/nextjs-migration/components/cozy/CozySearchSection';
import CozyArticlesSection from '@/nextjs-migration/components/cozy/CozyArticlesSection';
import CozyTagsSection from '@/nextjs-migration/components/cozy/CozyTagsSection';
import { CozyArticle, CozyCategory, CozyTag } from '@/types/cozy';

export const metadata: Metadata = {
  title: 'Уют | Мой блог',
  description: 'Создание уюта и комфорта в доме. Идеи для интерьера и декора.',
};

// Функции для получения данных
async function getCozyHighlights(): Promise<CozyArticle[]> {
  try {
    return await fetchAPI<CozyArticle[]>('/cozy/highlights');
  } catch (error) {
    console.error('Error fetching cozy highlights:', error);
    return [] as CozyArticle[];
  }
}

async function getCozyArticles(): Promise<CozyArticle[]> {
  try {
    return await fetchAPI<CozyArticle[]>('/cozy/articles');
  } catch (error) {
    console.error('Error fetching cozy articles:', error);
    return [] as CozyArticle[];
  }
}

async function getCozyCategories(): Promise<CozyCategory[]> {
  try {
    return await fetchAPI<CozyCategory[]>('/cozy/categories');
  } catch (error) {
    console.error('Error fetching cozy categories:', error);
    return [] as CozyCategory[];
  }
}

async function getCozyTags(): Promise<CozyTag[]> {
  try {
    return await fetchAPI<CozyTag[]>('/cozy/tags');
  } catch (error) {
    console.error('Error fetching cozy tags:', error);
    return [] as CozyTag[];
  }
}

export default async function CozyPage() {
  // Получаем данные с сервера
  const [highlights, articles, categories, tags] = await Promise.all([
    getCozyHighlights(),
    getCozyArticles(),
    getCozyCategories(),
    getCozyTags()
  ]);
  
  return (
    <MainLayout>
      <section className="blog-container py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Уют и комфорт</h1>
        
        <CozyHighlightsSection highlights={highlights} />
        
        <CozySearchSection categories={categories} />
        
        <CozyArticlesSection articles={articles} />
        
        <CozyTagsSection tags={tags} />
      </section>
    </MainLayout>
  );
}
