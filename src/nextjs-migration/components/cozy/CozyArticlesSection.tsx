
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cozy } from '@/types/cozy';

interface CozyArticleCardProps {
  article: Cozy;
}

const CozyArticleCard = ({ article }: CozyArticleCardProps) => {
  const { id, title, content, image, date, category, tags = [] } = article;

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/cozy/article/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blog-yellow text-blog-black font-medium">
              {category}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock size={16} className="mr-2" />
          <time>{typeof date === 'string' ? date : date.toISOString().split('T')[0]}</time>
        </div>

        <Link href={`/cozy/article/${id}`} className="block mb-3">
          <h3 className="text-xl font-bold hover:text-blog-yellow transition-colors">{title}</h3>
        </Link>

        <p className="text-gray-600 mb-4 flex-grow">{content}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Link key={index} href={`/cozy/tag/${tag}`}>
              <span className="text-sm text-gray-500 hover:text-blog-yellow transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

interface CozyArticlesSectionProps {
  articles: Cozy[];
}

const CozyArticlesSection = ({ articles }: CozyArticlesSectionProps) => {
  // По умолчанию выбрана вкладка "Все"
  const [activeTab, setActiveTab] = useState('all');
  
  // Если статьи не предоставлены, показываем заглушки
  const displayArticles = articles.length > 0 ? articles : Array(6).fill(null).map((_, i) => ({
    id: `article-${i + 1}`,
    title: `Статья о создании уюта ${i + 1}`,
    content: 'Краткое описание статьи о том, как создать уют в доме и сделать его комфортным для всей семьи.',
    image: '/placeholder.svg',
    category: i % 2 === 0 ? 'Интерьер' : 'Декор',
    tags: ['Уют', 'Дом', 'Декор'],
    date: new Date().toISOString(),
    type: 'Статья'
  }));
  
  // Группируем статьи по категориям для табов
  const interiorArticles = displayArticles.filter(a => a.category === 'Интерьер');
  const decorArticles = displayArticles.filter(a => a.category === 'Декор');
  const plantsArticles = displayArticles.filter(a => a.category === 'Растения');
  
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Статьи и советы</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="interior">Интерьер</TabsTrigger>
          <TabsTrigger value="decor">Декор</TabsTrigger>
          <TabsTrigger value="plants">Растения</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.slice(0, 6).map((article) => (
              <CozyArticleCard key={article.id} article={article} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="interior" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interiorArticles.length > 0 ? (
              interiorArticles.map((article) => (
                <CozyArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Нет статей в этой категории</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="decor" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decorArticles.length > 0 ? (
              decorArticles.map((article) => (
                <CozyArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Нет статей в этой категории</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="plants" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantsArticles.length > 0 ? (
              plantsArticles.map((article) => (
                <CozyArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Нет статей в этой категории</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-8">
        <Link 
          href="/cozy/articles"
          className="inline-block bg-blog-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          Все статьи
        </Link>
      </div>
    </section>
  );
};

export default CozyArticlesSection;
