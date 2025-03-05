
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Armchair, Lamp, Sprout, Coffee, Bath, Smartphone } from 'lucide-react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import HomeArticleCard from '../components/HomeArticleCard';
import HomeHighlightCard from '../components/HomeHighlightCard';
import { Button } from "@/components/ui/button";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { icon: <Armchair size={16} />, label: "Мебель" },
    { icon: <Lamp size={16} />, label: "Освещение" },
    { icon: <Sprout size={16} />, label: "Растения" },
    { icon: <Coffee size={16} />, label: "Кухня" },
    { icon: <Bath size={16} />, label: "Ванная" },
    { icon: <Smartphone size={16} />, label: "Умный дом" },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "Минимализм в маленькой квартире: 10 идей",
      excerpt: "Как создать уютное и функциональное пространство даже в маленькой квартире с помощью принципов минимализма.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2658",
      date: "15 октября 2023",
      category: "Интерьер",
      tags: ["Минимализм", "Маленькие пространства"]
    },
    {
      id: 2,
      title: "Скандинавский стиль в домашнем интерьере",
      excerpt: "Светлые тона, естественные материалы и функциональность — основы скандинавского стиля в оформлении дома.",
      image: "https://images.unsplash.com/photo-1595515722963-3f67c32efc48?auto=format&fit=crop&q=80&w=2670",
      date: "3 октября 2023",
      category: "Дизайн",
      tags: ["Скандинавский стиль", "Светлый интерьер"]
    },
    {
      id: 3,
      title: "Как выбрать растения для дома: гид для начинающих",
      excerpt: "Подробный гид по выбору неприхотливых комнатных растений, которые подойдут даже тем, у кого нет опыта.",
      image: "https://images.unsplash.com/photo-1545165375-7c5f3c866b50?auto=format&fit=crop&q=80&w=2670",
      date: "28 сентября 2023",
      category: "Растения",
      tags: ["Комнатные растения", "Уход"]
    },
    {
      id: 4,
      title: "Уютная спальня: секреты хорошего сна",
      excerpt: "Как создать спальню своей мечты, где вы будете отлично высыпаться и заряжаться энергией на весь день.",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=2580",
      date: "22 сентября 2023",
      category: "Спальня",
      tags: ["Сон", "Уют"]
    },
    {
      id: 5,
      title: "Новые технологии для умного дома в 2023 году",
      excerpt: "Обзор самых интересных и полезных новинок в области умного дома, которые можно внедрить уже сейчас.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2670",
      date: "15 сентября 2023",
      category: "Технологии",
      tags: ["Умный дом", "Гаджеты"]
    },
    {
      id: 6,
      title: "Декор стен своими руками: 5 простых идей",
      excerpt: "Бюджетные и креативные способы обновить интерьер с помощью декорирования стен без ремонта.",
      image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?auto=format&fit=crop&q=80&w=2670",
      date: "10 сентября 2023",
      category: "DIY",
      tags: ["Декор", "Своими руками"]
    }
  ];

  const highlights = [
    {
      id: 1,
      title: "Эко-стиль в современном интерьере",
      content: "Природные материалы, натуральные текстуры и спокойные цвета создают гармоничное пространство для жизни в стиле эко.",
      image: "https://images.unsplash.com/photo-1616627978145-6a53a33e29c9?auto=format&fit=crop&q=80&w=2670",
      type: "Тренд сезона"
    },
    {
      id: 2,
      title: "Организация хранения в маленькой квартире",
      content: "Максимальное использование пространства, многофункциональная мебель и умные системы хранения — ключи к порядку.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2669",
      type: "Практические советы"
    }
  ];

  const popularTags = ["Минимализм", "Скандинавский стиль", "Хранение", "Комнатные растения", "Уют", "DIY", "Эко-стиль", "Умный дом", "Освещение", "Маленькие пространства"];

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
          
          {/* Search and categories */}
          <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
            <div className="relative mb-8">
              <Input 
                type="text" 
                placeholder="Поиск идей для дома..." 
                className="pl-10 pr-4 py-3 w-full"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-blog-yellow-light hover:text-blog-black transition-colors"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {highlights.map((highlight) => (
              <HomeHighlightCard key={highlight.id} {...highlight} />
            ))}
          </div>
          
          {/* Tabs with article categories */}
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
                {featuredArticles.map((article) => (
                  <HomeArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="interior" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.filter(a => ["Интерьер", "Дизайн", "Спальня"].includes(a.category)).map((article) => (
                  <HomeArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="plants" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.filter(a => a.category === "Растения").map((article) => (
                  <HomeArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="diy" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.filter(a => a.category === "DIY").map((article) => (
                  <HomeArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.filter(a => a.category === "Технологии").map((article) => (
                  <HomeArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Popular tags */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-6">Популярные темы</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <Badge 
                  key={index}
                  className="bg-blog-gray text-gray-700 hover:bg-blog-yellow hover:text-blog-black cursor-pointer px-3 py-1.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Home;
