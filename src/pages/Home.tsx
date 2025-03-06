
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useHomeArticles, useHomeHighlights, useHomeCategories, useHomeTags } from '@/hooks/useApi';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import SearchCategoriesSection from '../components/home/SearchCategoriesSection';
import HighlightsSection from '../components/home/HighlightsSection';
import ArticlesTabsSection from '../components/home/ArticlesTabsSection';
import PopularTagsSection from '../components/home/PopularTagsSection';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { toast } = useToast();
  
  const { 
    data: allArticles = [], 
    isLoading: isLoadingArticles,
    error: articlesError 
  } = useHomeArticles();
  
  const { 
    data: highlights = [], 
    isLoading: isLoadingHighlights,
    error: highlightsError 
  } = useHomeHighlights();
  
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useHomeCategories();
  
  const { 
    data: tags = [], 
    isLoading: isLoadingTags 
  } = useHomeTags();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            ДОМ И УЮТ
          </h1>
          
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <p className="text-lg text-gray-600">
              Идеи для создания красивого и функционального интерьера, советы по уходу за растениями, 
              лайфхаки по организации пространства и вдохновение для вашего дома.
            </p>
          </div>
          
          <SearchCategoriesSection categories={categories} />
          <HighlightsSection highlights={highlights} />
          <ArticlesTabsSection articles={allArticles} />
          <PopularTagsSection tags={popularTags} />
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Home;
