
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCozyArticles, useCozyHighlights, useCozyCategories, useCozyTags, useApi } from '@/hooks/useApi';
import { Category } from '@/services/api/mainApi';

import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';

import CozySearchCategoriesSection from '../components/cozy/CozySearchCategoriesSection.tsx';
import CozyHighlightsSection from '../components/cozy/CozyHighlightsSection.tsx';
import CozyArticlesTabsSection from '../components/cozy/CozyArticlesTabsSection.tsx';
import CozyPopularTagsSection from '../components/cozy/CozyPopularTagsSection.tsx';

import { Loader2 } from 'lucide-react';

const Cozy = () => {
  const { toast } = useToast();
  const { api } = useApi();
  const [pageInfo, setPageInfo] = useState<Category | null>(null);

  const {
    data: allArticles = [],
    isLoading: isLoadingArticles,
    error: articlesError
  } = useCozyArticles();

  const {
    data: highlights = [],
    isLoading: isLoadingHighlights,
    error: highlightsError
  } = useCozyHighlights();

  const {
    data: categories = [],
    isLoading: isLoadingCategories
  } = useCozyCategories();

  const {
    data: tags = [],
    isLoading: isLoadingTags
  } = useCozyTags();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch page info from navigation categories
    api.main.getIndexCategories().then(navCategories => {
      const cozyPageInfo = navCategories.find(cat => cat.link === '/cozy');
      setPageInfo(cozyPageInfo || null);
    });
  }, [api.main]);

  useEffect(() => {
    if (highlightsError || articlesError) {
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить материалы. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    }
  }, [highlightsError, articlesError, toast]);

  const isLoading = isLoadingArticles || isLoadingHighlights || isLoadingCategories || isLoadingTags;

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blog-yellow" />
      </main>
    );
  }

  const popularTags = tags.slice(0, 10).map(tag => tag.name);

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />

      <div className="bg-blog-gray">
        <div className="blog-container py-16">
          <h1 className="section-title mb-8 text-center">
            {pageInfo?.title || "ДОМ И УЮТ"}
          </h1>

          <div className="max-w-2xl mx-auto mb-16 text-center">
            <p className="text-lg text-gray-600">
              {pageInfo?.pageDescription || "Идеи для создания красивого и функционального интерьера, советы по уходу за растениями, лайфхаки по организации пространства и вдохновение для вашего дома."}
            </p>
          </div>

          <CozySearchCategoriesSection categories={categories} />
          <CozyHighlightsSection highlights={highlights} />
          <CozyArticlesTabsSection articles={allArticles} />
          <CozyPopularTagsSection tags={popularTags} />
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Cozy;
