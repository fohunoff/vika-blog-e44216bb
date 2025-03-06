
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CozyArticleCard from './CozyArticleCard.tsx';
import { CozyArticle } from '@/types/models';

interface ArticlesTabsSectionProps {
  articles: CozyArticle[];
}

const CozyArticlesTabsSection = ({ articles }: ArticlesTabsSectionProps) => {
  return (
    <Tabs defaultValue="all" className="mb-16">
      <TabsList className="mb-8 bg-transparent border-b border-gray-200 w-full justify-start space-x-8 px-0">
        <TabsTrigger value="all" className="data-[state=active]:border-blog-yellow data-[state=active]:text-blog-black border-b-2 border-transparent pb-2 rounded-none">
          Все статьи
        </TabsTrigger>
        <TabsTrigger value="interior" className="data-[state=active]:border-blog-yellow data-[state=active]:text-blog-black border-b-2 border-transparent pb-2 rounded-none">
          Интерьер
        </TabsTrigger>
        <TabsTrigger value="plants" className="data-[state=active]:border-blog-yellow data-[state=active]:text-blog-black border-b-2 border-transparent pb-2 rounded-none">
          Растения
        </TabsTrigger>
        <TabsTrigger value="diy" className="data-[state=active]:border-blog-yellow data-[state=active]:text-blog-black border-b-2 border-transparent pb-2 rounded-none">
          Своими руками
        </TabsTrigger>
        <TabsTrigger value="tech" className="data-[state=active]:border-blog-yellow data-[state=active]:text-blog-black border-b-2 border-transparent pb-2 rounded-none">
          Технологии
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(a => !a.isHighlight).map((article) => (
            <CozyArticleCard key={article.id} article={article} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="interior" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(a => !a.isHighlight && ["Интерьер", "Дизайн", "Спальня"].includes(a.category)).map((article) => (
            <CozyArticleCard key={article.id} article={article} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="plants" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(a => !a.isHighlight && a.category === "Растения").map((article) => (
            <CozyArticleCard key={article.id} article={article} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="diy" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(a => !a.isHighlight && a.category === "DIY").map((article) => (
            <CozyArticleCard key={article.id} article={article} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="tech" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(a => !a.isHighlight && a.category === "Технологии").map((article) => (
            <CozyArticleCard key={article.id} article={article} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CozyArticlesTabsSection;
