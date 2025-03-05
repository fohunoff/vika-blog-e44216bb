
import { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import SearchCategoriesSection from '../components/home/SearchCategoriesSection';
import HighlightsSection from '../components/home/HighlightsSection';
import ArticlesTabsSection from '../components/home/ArticlesTabsSection';
import PopularTagsSection from '../components/home/PopularTagsSection';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          
          <SearchCategoriesSection />
          <HighlightsSection highlights={highlights} />
          <ArticlesTabsSection articles={featuredArticles} />
          <PopularTagsSection tags={popularTags} />
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Home;
